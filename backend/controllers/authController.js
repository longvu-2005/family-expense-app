const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Bộ nhớ tạm lưu mã OTP khôi phục mật khẩu (TTL: 10 phút)
// Key: email -> { otp, expiresAt, verified }
const otpStore = new Map();

// Tự động dọn dẹp các mã OTP đã quá hạn mỗi 5 phút
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of otpStore.entries()) {
        if (now > value.expiresAt) {
            otpStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

// Chuyển ký tự đặc biệt thành HTML entity để tránh chèn HTML injection
const escapeHtml = (value = '') => {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
};

/**
 * =========================================================================
 * 1. API ĐĂNG KÝ TÀI KHOẢN (REGISTER)
 * URL: POST /api/auth/register
 * Body: { full_name, email, password }
 * =========================================================================
 */
exports.register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // 1. Kiểm tra đầu vào
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Kiểm tra định dạng email cơ bản
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email không hợp lệ!'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự!'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        // 2. Kiểm tra email đã tồn tại
        const checkUser = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query('SELECT user_id FROM Users WHERE email = @email');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được sử dụng. Vui lòng đăng nhập!'
            });
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Mặc định tài khoản đăng ký mới là user thường (role = 2)
        const defaultRole = 2;

        const insertResult = await pool.request()
            .input('full_name', sql.NVarChar, full_name.trim())
            .input('email', sql.VarChar, cleanEmail)
            .input('password_hash', sql.VarChar, password_hash)
            .input('role', sql.Int, defaultRole)
            .query(`
                INSERT INTO Users (
                    full_name,
                    email,
                    password_hash,
                    role,
                    created_at
                )
                OUTPUT
                    INSERTED.user_id,
                    INSERTED.full_name,
                    INSERTED.email,
                    INSERTED.role,
                    INSERTED.created_at
                VALUES (
                    @full_name,
                    @email,
                    @password_hash,
                    @role,
                    GETDATE()
                )
            `);

        const newUser = insertResult.recordset[0];

        // 5. Tạo JWT Token
        const token = jwt.sign(
            {
                user_id: newUser.user_id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        // 6. Trả kết quả, không trả password_hash
        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            token,
            user: {
                user_id: newUser.user_id,
                full_name: newUser.full_name,
                email: newUser.email,
                role: newUser.role,
                created_at: newUser.created_at
            }
        });

    } catch (err) {
        console.error('Lỗi khi đăng ký:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng ký: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 2. API ĐĂNG NHẬP (LOGIN)
 * URL: POST /api/auth/login
 * Body: { email, password }
 * =========================================================================
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập Email và Mật khẩu!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        // 2. Lấy thông tin người dùng, bao gồm role
        const result = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query(`
                SELECT
                    user_id,
                    full_name,
                    email,
                    password_hash,
                    role,
                    created_at
                FROM Users
                WHERE email = @email
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!'
            });
        }

        const user = result.recordset[0];

        // 3. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!'
            });
        }

        // 4. Kiểm tra role từ database
        const role = Number(user.role);

        if (![1, 2].includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Tài khoản chưa được cấu hình quyền hợp lệ.'
            });
        }

        // 5. Tạo JWT Token, đưa role vào token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: role
            },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        // 6. Trả thông tin người dùng, không trả password_hash
        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: role,
                created_at: user.created_at
            }
        });

    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng nhập: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 3. API YÊU CẦU QUÊN MẬT KHẨU (FORGOT PASSWORD)
 * URL: POST /api/auth/forgot-password
 * Body: { email }
 * Gửi OTP 6 chữ số qua Gmail, hiệu lực 10 phút.
 * =========================================================================
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập địa chỉ email!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Kiểm tra định dạng email cơ bản
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email không hợp lệ!'
            });
        }

        // 1. Kết nối SQL Server
        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        // 2. Kiểm tra email có tồn tại không
        const userCheck = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query(`
                SELECT user_id, full_name, email
                FROM Users
                WHERE email = @email
            `);

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản với email này trong hệ thống!'
            });
        }

        const user = userCheck.recordset[0];

        // 3. Sinh OTP bảo mật gồm 6 chữ số
        const otp = crypto.randomInt(100000, 1000000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút

        // 4. Thiết kế email chuẩn HTML chuyên nghiệp
        const safeName = escapeHtml(user.full_name || 'Bạn');
        const safeEmail = escapeHtml(cleanEmail);

        const message = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Khôi phục mật khẩu</title>
        </head>
        <body style="
            margin: 0;
            padding: 0;
            background-color: #080b16;
            font-family: Arial, Helvetica, sans-serif;
            color: #f1f5f9;
        ">
            <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
                Mã xác nhận khôi phục mật khẩu Family Management của bạn là ${otp}.
            </div>

            <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="background-color: #080b16; padding: 36px 12px;"
            >
                <tr>
                    <td align="center">
                        <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            style="
                                max-width: 560px;
                                background-color: #111629;
                                border: 1px solid #303653;
                                border-radius: 20px;
                                overflow: hidden;
                            "
                        >
                            <!-- Header -->
                            <tr>
                                <td style="
                                    padding: 30px 28px;
                                    text-align: center;
                                    background-color: #171b35;
                                    border-bottom: 1px solid #303653;
                                ">
                                    <div style="
                                        display: inline-block;
                                        padding: 10px 18px;
                                        border: 1px solid #6655d9;
                                        border-radius: 12px;
                                        color: #c4b5fd;
                                        font-size: 12px;
                                        font-weight: bold;
                                        letter-spacing: 2px;
                                    ">
                                        FAMILY MANAGEMENT
                                    </div>

                                    <h1 style="
                                        margin: 22px 0 8px;
                                        color: #ffffff;
                                        font-size: 26px;
                                        line-height: 1.35;
                                    ">
                                        Khôi phục mật khẩu
                                    </h1>

                                    <p style="
                                        margin: 0;
                                        color: #a5b4fc;
                                        font-size: 14px;
                                    ">
                                        Bảo mật tài khoản của bạn
                                    </p>
                                </td>
                            </tr>

                            <!-- Main content -->
                            <tr>
                                <td style="padding: 30px 28px;">
                                    <p style="
                                        margin: 0 0 14px;
                                        color: #f8fafc;
                                        font-size: 16px;
                                        line-height: 1.7;
                                    ">
                                        Xin chào <strong>${safeName}</strong>,
                                    </p>

                                    <p style="
                                        margin: 0 0 22px;
                                        color: #cbd5e1;
                                        font-size: 14px;
                                        line-height: 1.9;
                                    ">
                                        Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản Family Management của bạn.
                                        Hãy sử dụng mã xác nhận bên dưới để tiếp tục.
                                    </p>

                                    <!-- OTP BOX -->
                                    <div style="
                                        padding: 25px 16px;
                                        text-align: center;
                                        background-color: #1c2040;
                                        border: 1px solid #6655d9;
                                        border-radius: 16px;
                                    ">
                                        <p style="
                                            margin: 0 0 14px;
                                            color: #c4b5fd;
                                            font-size: 12px;
                                            font-weight: bold;
                                            letter-spacing: 2px;
                                        ">
                                            MÃ XÁC NHẬN OTP
                                        </p>

                                        <div style="
                                            color: #ffffff;
                                            font-size: 38px;
                                            font-weight: bold;
                                            letter-spacing: 10px;
                                            line-height: 1.4;
                                        ">
                                            ${otp}
                                        </div>

                                        <p style="
                                            margin: 14px 0 0;
                                            color: #a5b4fc;
                                            font-size: 12px;
                                        ">
                                            Mã có hiệu lực trong 10 phút
                                        </p>
                                    </div>

                                    <p style="
                                        margin: 24px 0 10px;
                                        color: #cbd5e1;
                                        font-size: 13px;
                                        line-height: 1.8;
                                    ">
                                        <strong style="color: #f8fafc;">Lưu ý bảo mật:</strong>
                                        Tuyệt đối không chia sẻ mã OTP này với bất kỳ ai, kể cả người tự xưng là quản trị viên.
                                    </p>

                                    <div style="
                                        margin-top: 20px;
                                        padding: 14px 16px;
                                        background-color: #211b30;
                                        border-left: 3px solid #a78bfa;
                                        border-radius: 8px;
                                    ">
                                        <p style="
                                            margin: 0;
                                            color: #ddd6fe;
                                            font-size: 12px;
                                            line-height: 1.8;
                                        ">
                                            Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn được an toàn.
                                        </p>
                                    </div>

                                    <p style="
                                        margin: 26px 0 0;
                                        color: #94a3b8;
                                        font-size: 12px;
                                        line-height: 1.8;
                                    ">
                                        Email được gửi tới:
                                        <span style="color: #c4b5fd;">
                                            ${safeEmail}
                                        </span>
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="
                                    padding: 22px 28px;
                                    text-align: center;
                                    background-color: #0c1020;
                                    border-top: 1px solid #303653;
                                ">
                                    <p style="
                                        margin: 0 0 8px;
                                        color: #c4b5fd;
                                        font-size: 13px;
                                        font-weight: bold;
                                    ">
                                        FAMILY MANAGEMENT
                                    </p>

                                    <p style="
                                        margin: 0;
                                        color: #64748b;
                                        font-size: 11px;
                                        line-height: 1.8;
                                    ">
                                        Email tự động từ hệ thống quản lý chi tiêu gia đình. Vui lòng không trả lời thư này.
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <p style="
                            max-width: 500px;
                            margin: 20px auto 0;
                            color: #64748b;
                            font-size: 11px;
                            line-height: 1.8;
                            text-align: center;
                        ">
                            © Family Management System. Bảo vệ thông tin, kết nối tài chính gia đình.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        // 5. Lưu OTP tạm thời vào bộ nhớ
        otpStore.set(cleanEmail, { otp, expiresAt, verified: false });

        // 6. Gửi email xác thực
        try {
            await sendEmail({
                email: cleanEmail,
                subject: '🔐 Mã xác nhận khôi phục mật khẩu | Family Management',
                text: `Xin chào ${user.full_name || 'Bạn'},\n\nMã xác nhận OTP khôi phục mật khẩu của bạn là: ${otp}\nMã có hiệu lực trong vòng 10 phút. Không chia sẻ mã này với bất kỳ ai.\n\nFamily Management System`,
                message
            });
        } catch (emailError) {
            // Nếu gửi email thất bại, xóa OTP đã lưu
            otpStore.delete(cleanEmail);
            console.error('Lỗi khi gửi email qua Gmail SMTP:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Không thể gửi email xác nhận. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau!'
            });
        }

        // 7. Trả phản hồi thành công (không để lộ OTP ra response)
        return res.json({
            success: true,
            message: 'Mã OTP xác nhận đã được gửi thành công tới Gmail của bạn!',
            email: cleanEmail,
            expiresIn: 600
        });

    } catch (err) {
        console.error('Lỗi Forgot Password:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi yêu cầu quên mật khẩu: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 3.1. API XÁC MINH MÃ OTP (VERIFY OTP)
 * URL: POST /api/auth/verify-otp
 * Body: { email, otp }
 * =========================================================================
 */
exports.verifyOtp = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const otp = String(req.body.otp || '').trim();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ email và mã OTP.'
            });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã OTP mới.'
            });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Mã OTP đã hết hạn (quá 10 phút). Vui lòng yêu cầu mã mới.'
            });
        }

        if (String(record.otp) !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại Gmail của bạn.'
            });
        }

        // Đánh dấu OTP này đã được xác minh thành công
        otpStore.set(email, {
            ...record,
            verified: true
        });

        return res.json({
            success: true,
            message: 'Xác minh OTP thành công! Bạn có thể tạo mật khẩu mới.'
        });
    } catch (error) {
        console.error('verifyOtp error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi xác minh OTP: ' + error.message
        });
    }
};

/**
 * =========================================================================
 * 4. API ĐẶT LẠI MẬT KHẨU MỚI (RESET PASSWORD)
 * URL: POST /api/auth/reset-password
 * Body: { email, otp, new_password }
 * =========================================================================
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;

        if (!email || !new_password || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ Email, mã OTP và Mật khẩu mới!'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Bắt buộc OTP phải tồn tại, đúng và đã được xác minh
        const stored = otpStore.get(cleanEmail);

        if (!stored) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng gửi lại yêu cầu OTP mới!'
            });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(cleanEmail);
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực đã hết hạn (quá 10 phút). Vui lòng yêu cầu mã mới!'
            });
        }

        if (String(stored.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực OTP không đúng!'
            });
        }

        if (!stored.verified) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng xác minh mã OTP trước khi tiến hành đổi mật khẩu!'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(new_password, salt);

        // Cập nhật vào SQL Server
        const updateResult = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .input('password_hash', sql.VarChar, password_hash)
            .query(
                'UPDATE Users SET password_hash = @password_hash WHERE email = @email'
            );

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng với email này để cập nhật.'
            });
        }

        // Xóa mã OTP đã sử dụng xong
        otpStore.delete(cleanEmail);

        return res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công! Bạn có thể dùng mật khẩu mới để đăng nhập ngay.'
        });

    } catch (err) {
        console.error('Lỗi Reset Password:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đặt lại mật khẩu: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 5. API LẤY THÔNG TIN TÀI KHOẢN ĐANG ĐĂNG NHẬP (GET CURRENT USER)
 * URL: GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * =========================================================================
 */
exports.getMe = async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        const userId = req.user?.user_id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin xác thực không hợp lệ.'
            });
        }

        // req.user được gán từ authMiddleware sau khi giải mã token
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query('SELECT user_id, full_name, email, role, created_at FROM Users WHERE user_id = @user_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin tài khoản người dùng.'
            });
        }

        return res.json({
            success: true,
            user: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi lấy thông tin User:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi lấy thông tin người dùng: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 6. API ĐỔI MẬT KHẨU KHI ĐÃ ĐĂNG NHẬP (CHANGE PASSWORD)
 * URL: PUT /api/auth/change-password
 * Header: Authorization: Bearer <token>
 * Body: { old_password, new_password } hoặc { current_password, new_password }
 * =========================================================================
 */
exports.changePassword = async (req, res) => {
    try {
        const old_password = req.body.old_password || req.body.current_password;
        const { new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp cả Mật khẩu hiện tại và Mật khẩu mới!'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự!'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        const userId = req.user?.user_id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin xác thực không hợp lệ.'
            });
        }

        // Lấy thông tin mật khẩu hiện tại trong DB
        const userResult = await pool.request()
            .input('user_id', sql.Int, userId)
            .query('SELECT password_hash FROM Users WHERE user_id = @user_id');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản người dùng.'
            });
        }

        const isMatch = await bcrypt.compare(old_password, userResult.recordset[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu hiện tại không chính xác!'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const new_password_hash = await bcrypt.hash(new_password, salt);

        await pool.request()
            .input('user_id', sql.Int, userId)
            .input('password_hash', sql.VarChar, new_password_hash)
            .query('UPDATE Users SET password_hash = @password_hash WHERE user_id = @user_id');

        return res.json({
            success: true,
            message: 'Đổi mật khẩu thành công!'
        });

    } catch (err) {
        console.error('Lỗi Change Password:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đổi mật khẩu: ' + err.message
        });
    }
};
