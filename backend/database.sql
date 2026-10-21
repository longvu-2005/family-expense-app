-- ========================================================
-- Script khởi tạo Database cho Family Expense App
-- Chạy script này trong SQL Server Management Studio (SSMS)
-- ========================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FamilyExpenseDB')
BEGIN
    CREATE DATABASE FamilyExpenseDB;
END
GO

USE FamilyExpenseDB;
GO

-- 1. Bảng Users (Người dùng)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(150),
        avatar_url NVARCHAR(500),
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Bảng Categories (Danh mục chi tiêu)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        icon NVARCHAR(50),
        color NVARCHAR(20)
    );

    -- Dữ liệu mẫu danh mục
    INSERT INTO Categories (name, icon, color) VALUES
    (N'Ăn uống', 'Utensils', '#f97316'),
    (N'Siêu thị & Tạp hóa', 'ShoppingCart', '#10b981'),
    (N'Mua sắm', 'ShoppingBag', '#3b82f6'),
    (N'Di chuyển & Xăng xe', 'Car', '#8b5cf6'),
    (N'Hóa đơn điện nước', 'Receipt', '#eab308'),
    (N'Y tế & Sức khỏe', 'HeartPulse', '#ef4444'),
    (N'Giáo dục', 'GraduationCap', '#06b6d4'),
    (N'Khác', 'MoreHorizontal', '#64748b');
END
GO

-- 3. Bảng Expenses (Các khoản chi tiêu)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Expenses')
BEGIN
    CREATE TABLE Expenses (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE SET NULL,
        store_name NVARCHAR(255) NULL,
        total_amount DECIMAL(18, 2) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        expense_date DATE DEFAULT CAST(GETDATE() AS DATE),
        image_url NVARCHAR(500) NULL,
        note NVARCHAR(500) NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

PRINT N'✅ Khởi tạo Database FamilyExpenseDB và các bảng thành công!';
