const { poolPromise, sql } = require('../config/db');

/**
 * 1. Gửi tin nhắn mới (hỗ trợ cả chat 1-1 và chat Nhóm)
 * POST /api/messages
 * Body: { sender_id, receiver_id, group_id, content }
 */
exports.sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, group_id, content } = req.body;

        if (!sender_id || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp người gửi và nội dung tin nhắn.'
            });
        }

        if (!receiver_id && !group_id) {
            return res.status(400).json({
                success: false,
                message: 'Tin nhắn phải có người nhận hoặc nhóm nhận.'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu SQL Server.'
            });
        }

        const cleanContent = content.trim();

        if (group_id) {
            // Tin nhắn nhóm
            await pool.request()
                .input('sender_id', sql.Int, sender_id)
                .input('group_id', sql.Int, group_id)
                .input('content', sql.NVarChar, cleanContent)
                .query(`
                    INSERT INTO Messages (sender_id, receiver_id, group_id, content, is_read, created_at)
                    VALUES (@sender_id, NULL, @group_id, @content, 0, GETDATE())
                `);
        } else {
            // Tin nhắn 1 - 1
            await pool.request()
                .input('sender_id', sql.Int, sender_id)
                .input('receiver_id', sql.Int, receiver_id)
                .input('content', sql.NVarChar, cleanContent)
                .query(`
                    INSERT INTO Messages (sender_id, receiver_id, group_id, content, is_read, created_at)
                    VALUES (@sender_id, @receiver_id, NULL, @content, 0, GETDATE())
                `);
        }

        return res.json({
            success: true,
            message: 'Gửi tin nhắn thành công!'
        });
    } catch (error) {
        console.error('Lỗi server khi gửi tin nhắn:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi gửi tin nhắn: ' + error.message
        });
    }
};

/**
 * 2. Lấy lịch sử tin nhắn 1 - 1 giữa 2 người dùng
 * GET /api/messages/:user1/:user2
 */
exports.getMessages = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối tới cơ sở dữ liệu.'
            });
        }

        // Lấy tin nhắn
        const result = await pool.request()
            .input('u1', sql.Int, user1)
            .input('u2', sql.Int, user2)
            .query(`
                SELECT 
                    m.message_id,
                    m.sender_id,
                    m.receiver_id,
                    m.group_id,
                    m.content,
                    m.is_read,
                    m.created_at,
                    u.full_name AS sender_name,
                    u.role AS sender_role
                FROM Messages m
                LEFT JOIN Users u ON m.sender_id = u.user_id
                WHERE (m.group_id IS NULL)
                  AND ((m.sender_id = @u1 AND m.receiver_id = @u2)
                   OR  (m.sender_id = @u2 AND m.receiver_id = @u1))
                ORDER BY m.created_at ASC
            `);

        // Đánh dấu các tin nhắn người này nhận từ người kia là đã đọc
        await pool.request()
            .input('receiver_id', sql.Int, user1)
            .input('sender_id', sql.Int, user2)
            .query(`
                UPDATE Messages 
                SET is_read = 1 
                WHERE receiver_id = @receiver_id 
                  AND sender_id = @sender_id 
                  AND is_read = 0
            `);

        return res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi lấy lịch sử tin nhắn:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi lấy lịch sử tin nhắn: ' + error.message
        });
    }
};

/**
 * 3. Lấy tin nhắn trong Nhóm
 * GET /api/messages/group/:groupId
 */
exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối cơ sở dữ liệu.'
            });
        }

        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .query(`
                SELECT 
                    m.message_id,
                    m.sender_id,
                    m.receiver_id,
                    m.group_id,
                    m.content,
                    m.is_read,
                    m.created_at,
                    u.full_name AS sender_name,
                    u.role AS sender_role
                FROM Messages m
                LEFT JOIN Users u ON m.sender_id = u.user_id
                WHERE m.group_id = @groupId
                ORDER BY m.created_at ASC
            `);

        return res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi lấy tin nhắn nhóm:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi lấy tin nhắn nhóm: ' + error.message
        });
    }
};

/**
 * 4. Lấy danh sách liên hệ (Người dùng & Admin) kèm tin nhắn gần nhất
 * GET /api/messages/contacts/:userId
 */
exports.getContacts = async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối cơ sở dữ liệu.'
            });
        }

        // Lấy tất cả user khác, kèm số tin chưa đọc từ họ
        const result = await pool.request()
            .input('myId', sql.Int, userId)
            .query(`
                SELECT 
                    u.user_id,
                    u.full_name,
                    u.email,
                    u.role,
                    (
                        SELECT COUNT(*) 
                        FROM Messages 
                        WHERE sender_id = u.user_id 
                          AND receiver_id = @myId 
                          AND is_read = 0
                    ) AS unread_count,
                    (
                        SELECT TOP 1 content 
                        FROM Messages 
                        WHERE (sender_id = u.user_id AND receiver_id = @myId)
                           OR (sender_id = @myId AND receiver_id = u.user_id)
                        ORDER BY created_at DESC
                    ) AS last_message,
                    (
                        SELECT TOP 1 created_at 
                        FROM Messages 
                        WHERE (sender_id = u.user_id AND receiver_id = @myId)
                           OR (sender_id = @myId AND receiver_id = u.user_id)
                        ORDER BY created_at DESC
                    ) AS last_message_time
                FROM Users u
                WHERE u.user_id != @myId
                ORDER BY u.role ASC, last_message_time DESC, u.full_name ASC
            `);

        return res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi lấy danh bạ liên hệ:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh bạ liên hệ: ' + error.message
        });
    }
};

/**
 * 5. Lấy danh sách nhóm của user
 * GET /api/messages/groups/:userId
 */
exports.getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối cơ sở dữ liệu.'
            });
        }

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    g.group_id,
                    g.group_name,
                    g.created_by,
                    g.created_at,
                    (
                        SELECT COUNT(*) 
                        FROM GroupMembers 
                        WHERE group_id = g.group_id
                    ) AS member_count,
                    (
                        SELECT TOP 1 m.content 
                        FROM Messages m 
                        WHERE m.group_id = g.group_id 
                        ORDER BY m.created_at DESC
                    ) AS last_message,
                    (
                        SELECT TOP 1 m.created_at 
                        FROM Messages m 
                        WHERE m.group_id = g.group_id 
                        ORDER BY m.created_at DESC
                    ) AS last_message_time
                FROM Groups g
                INNER JOIN GroupMembers gm ON g.group_id = gm.group_id
                WHERE gm.user_id = @userId
                ORDER BY last_message_time DESC, g.created_at DESC
            `);

        return res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách nhóm:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách nhóm: ' + error.message
        });
    }
};

/**
 * 6. Tạo nhóm chat mới
 * POST /api/messages/groups
 * Body: { group_name, created_by, member_ids: [1, 2, ...] }
 */
exports.createGroup = async (req, res) => {
    try {
        const { group_name, created_by, member_ids } = req.body;

        if (!group_name || !group_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên nhóm.'
            });
        }

        if (!created_by) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin người tạo nhóm.'
            });
        }

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối cơ sở dữ liệu.'
            });
        }

        // 1. Tạo nhóm
        const groupInsert = await pool.request()
            .input('group_name', sql.NVarChar, group_name.trim())
            .input('created_by', sql.Int, created_by)
            .query(`
                INSERT INTO Groups (group_name, created_by, created_at)
                OUTPUT INSERTED.group_id, INSERTED.group_name
                VALUES (@group_name, @created_by, GETDATE())
            `);

        const newGroup = groupInsert.recordset[0];
        const newGroupId = newGroup.group_id;

        // 2. Thêm người tạo vào nhóm với role = 1 (trưởng nhóm)
        await pool.request()
            .input('group_id', sql.Int, newGroupId)
            .input('user_id', sql.Int, created_by)
            .input('role', sql.Int, 1)
            .query(`
                INSERT INTO GroupMembers (group_id, user_id, role, joined_at)
                VALUES (@group_id, @user_id, @role, GETDATE())
            `);

        // 3. Thêm các thành viên được chọn
        if (Array.isArray(member_ids) && member_ids.length > 0) {
            for (const memberId of member_ids) {
                if (Number(memberId) !== Number(created_by)) {
                    await pool.request()
                        .input('group_id', sql.Int, newGroupId)
                        .input('user_id', sql.Int, memberId)
                        .input('role', sql.Int, 2)
                        .query(`
                            INSERT INTO GroupMembers (group_id, user_id, role, joined_at)
                            VALUES (@group_id, @user_id, @role, GETDATE())
                        `);
                }
            }
        }

        // 4. Gửi tin nhắn chào mừng hệ thống trong nhóm
        await pool.request()
            .input('sender_id', sql.Int, created_by)
            .input('group_id', sql.Int, newGroupId)
            .input('content', sql.NVarChar, `Đã tạo nhóm "${group_name.trim()}". Chào mừng các thành viên gia đình tham gia! 🎉`)
            .query(`
                INSERT INTO Messages (sender_id, receiver_id, group_id, content, is_read, created_at)
                VALUES (@sender_id, NULL, @group_id, @content, 0, GETDATE())
            `);

        return res.status(201).json({
            success: true,
            message: 'Tạo nhóm chat thành công!',
            group: newGroup
        });
    } catch (error) {
        console.error('Lỗi khi tạo nhóm:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo nhóm: ' + error.message
        });
    }
};

/**
 * 7. Lấy số lượng thông báo tin nhắn chưa đọc
 * GET /api/messages/unread/:userId
 */
exports.getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await poolPromise;
        if (!pool) {
            return res.status(503).json({
                success: false,
                message: 'Chưa thể kết nối cơ sở dữ liệu.'
            });
        }

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT COUNT(*) AS unread 
                FROM Messages 
                WHERE receiver_id = @userId 
                  AND is_read = 0
            `);

        return res.json({
            success: true,
            unreadCount: result.recordset[0].unread || 0
        });
    } catch (error) {
        console.error('Lỗi lấy số thông báo chưa đọc:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi lấy thông báo: ' + error.message
        });
    }
};