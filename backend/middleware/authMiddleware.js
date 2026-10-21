const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng cung cấp token xác thực (Bearer Token).'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ChuoiBiMatTuyetDoiCuaBan');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn.'
        });
    }
};

module.exports = authMiddleware;
