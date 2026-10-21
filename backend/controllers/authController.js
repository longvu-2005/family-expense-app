const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');

// Đăng ký tài khoản mới
exports.register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ tên đăng nhập (username) và mật khẩu (password).'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server. Vui lòng kiểm tra cấu hình database trong file .env!'
            });
        }

        // Kiểm tra xem username đã tồn tại chưa
        const checkUser = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT id FROM Users WHERE username = @username');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.'
            });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu user vào bảng Users
        const insertResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .input('fullName', sql.NVarChar, fullName || null)
            .query(`
                INSERT INTO Users (username, password, full_name, created_at)
                OUTPUT INSERTED.id, INSERTED.username, INSERTED.full_name
                VALUES (@username, @password, @fullName, GETDATE())
            `);

        const newUser = insertResult.recordset[0];

        // Tạo JWT Token
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            token,
            user: newUser
        });
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng ký tài khoản: ' + err.message
        });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên đăng nhập và mật khẩu.'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server. Vui lòng kiểm tra cấu hình database trong file .env!'
            });
        }

        // Tìm người dùng theo username
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
            });
        }

        const user = result.recordset[0];

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
            });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan',
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.full_name
            }
        });
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng nhập: ' + err.message
        });
    }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        const result = await pool.request()
            .input('id', sql.Int, req.user.id)
            .query('SELECT id, username, full_name, created_at FROM Users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng.'
            });
        }

        return res.json({
            success: true,
            user: result.recordset[0]
        });
    } catch (err) {
        console.error('Lỗi lấy thông tin user:', err);
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ: ' + err.message
        });
    }
};
