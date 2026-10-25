const nodemailer = require('nodemailer');
require('dotenv').config();

// Khởi tạo transporter với cấu hình Gmail tối ưu và có timeout chống treo request
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        const emailUser = (process.env.EMAIL_USER || '').trim();
        const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

        if (!emailUser || !emailPass) {
            throw new Error('Chưa cấu hình EMAIL_USER hoặc EMAIL_PASS trong file backend/.env');
        }

        transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            connectionTimeout: 10000, // 10 giây timeout kết nối
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
    }
    return transporter;
};

const sendEmail = async (options) => {
    const client = getTransporter();
    const emailUser = (process.env.EMAIL_USER || '').trim();

    const mailOptions = {
        from: `"Family Management" <${emailUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.text || 'Mã xác nhận bảo mật tài khoản Family Management.',
        html: options.message || options.html,
    };

    return await client.sendMail(mailOptions);
};

module.exports = sendEmail;