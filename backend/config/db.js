const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Để false khi chạy dưới local (development)
        trustServerCertificate: true // Tin tưởng chứng chỉ local
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log(`✅ Đã kết nối thành công tới SQL Server (${process.env.DB_NAME || 'FamilyExpenseDB'})!`);
        return pool;
    })
    .catch(err => {
        console.warn('⚠️ [Cảnh báo Database] Chưa thể kết nối tới SQL Server: ' + err.message);
        console.warn('👉 Lưu ý: Nếu máy bạn đang chạy SQL Server instance "SQLEXPRESS", hãy đổi DB_SERVER=localhost\\\\SQLEXPRESS trong file backend/.env');
        console.warn('👉 Server vẫn sẽ chạy để phục vụ các API khác (như Scan Hóa đơn).');
        return null;
    });

module.exports = { sql, poolPromise };