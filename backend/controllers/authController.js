const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Bộ nhớ tạm lưu mã OTP khôi phục mật khẩu (TTL: 10 phút)
// Key: email -> { otp, expiresAt }
const otpStore = new Map();

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
                message: 'Vui lòng điền đầy đủ Họ và tên (full_name), Email và Mật khẩu (password)!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải chứa ít nhất 6 ký tự!'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server. Vui lòng kiểm tra file .env!'
            });
        }

        // 2. Kiểm tra email đã tồn tại trong SQL Server chưa
        const checkUser = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query('SELECT user_id FROM Users WHERE email = @email');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc Đăng nhập!'
            });
        }

        // 3. Mã hóa mật khẩu an toàn bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Thêm tài khoản mới vào bảng Users
        const insertResult = await pool.request()
            .input('full_name', sql.NVarChar, full_name.trim())
            .input('email', sql.VarChar, cleanEmail)
            .input('password_hash', sql.VarChar, password_hash)
            .query(`
                INSERT INTO Users (full_name, email, password_hash, created_at)
                OUTPUT INSERTED.user_id, INSERTED.full_name, INSERTED.email, INSERTED.created_at
                VALUES (@full_name, @email, @password_hash, GETDATE())
            `);

        const newUser = insertResult.recordset[0];

        // 5. Tạo JWT Token đăng nhập luôn
        const token = jwt.sign(
            { user_id: newUser.user_id, email: newUser.email },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            token,
            user: {
                user_id: newUser.user_id,
                full_name: newUser.full_name,
                email: newUser.email,
                created_at: newUser.created_at
            }
        });

    } catch (err) {
        console.error('Lỗi khi Đăng ký:', err);
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
 * Kéo về đầy đủ các trường dữ liệu cho Frontend
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

        // 2. Tìm người dùng trong bảng Users theo Email
        const result = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query('SELECT user_id, full_name, email, password_hash, created_at FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!'
            });
        }

        const user = result.recordset[0];

        // 3. Kiểm tra mật khẩu mã hóa
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!'
            });
        }

        // 4. Tạo JWT Token (thời hạn 7 ngày)
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        // 5. Trả về đầy đủ các trường dữ liệu người dùng (không trả password_hash)
        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                created_at: user.created_at
            }
        });

    } catch (err) {
        console.error('Lỗi khi Đăng nhập:', err);
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
 * Kiểm tra tài khoản và sinh mã xác thực OTP (hiệu lực 10 phút)
 * =========================================================================
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp địa chỉ Email!'
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

        // Kiểm tra xem email có tồn tại trong hệ thống không
        const userCheck = await pool.request()
            .input('email', sql.VarChar, cleanEmail)
            .query('SELECT user_id, full_name, email FROM Users WHERE email = @email');

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản nào khớp với Email này!'
            });
        }

        const user = userCheck.recordset[0];

        // Tạo mã xác nhận OTP 6 chữ số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

        // Lưu vào bộ nhớ tạm
        otpStore.set(cleanEmail, { otp, expiresAt });

        console.log(`[Forgot Password] Email: ${cleanEmail} - OTP: ${otp}`);

        return res.json({
            success: true,
            message: 'Đã tạo mã xác thực khôi phục mật khẩu (có hiệu lực trong 10 phút)!',
            email: cleanEmail,
            full_name: user.full_name,
            otp // Trả về OTP để frontend hiển thị hoặc điền tự động khi phát triển
        });

    } catch (err) {
        console.error('Lỗi Forgot Password:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi xử lý quên mật khẩu: ' + err.message
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

        if (!email || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp Email và Mật khẩu mới!'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự!'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Nếu client có gửi otp thì xác minh OTP
        if (otp) {
            const stored = otpStore.get(cleanEmail);
            if (!stored) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng bấm Quên mật khẩu lại!'
                });
            }

            if (Date.now() > stored.expiresAt) {
                otpStore.delete(cleanEmail);
                return res.status(400).json({
                    success: false,
                    message: 'Mã xác thực đã hết hạn (quá 10 phút). Vui lòng yêu cầu mã mới!'
                });
            }

            if (stored.otp !== otp.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã xác thực OTP không đúng!'
                });
            }
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
            .query('UPDATE Users SET password_hash = @password_hash WHERE email = @email');

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng với email này để cập nhật.'
            });
        }

        // Xóa mã OTP đã sử dụng
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

        // req.user được gán từ authMiddleware sau khi giải mã token
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
            .query('SELECT user_id, full_name, email, created_at FROM Users WHERE user_id = @user_id');

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
            message: 'Lỗi máy chủ: ' + err.message
        });
    }
};

/**
 * =========================================================================
 * 6. API ĐỔI MẬT KHẨU KHI ĐÃ ĐĂNG NHẬP (CHANGE PASSWORD)
 * URL: PUT /api/auth/change-password
 * Header: Authorization: Bearer <token>
 * Body: { old_password, new_password }
 * =========================================================================
 */
exports.changePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp cả Mật khẩu hiện tại (old_password) và Mật khẩu mới (new_password)!'
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

        // Lấy thông tin mật khẩu hiện tại trong DB
        const userResult = await pool.request()
            .input('user_id', sql.Int, req.user.user_id)
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
            .input('user_id', sql.Int, req.user.user_id)
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
