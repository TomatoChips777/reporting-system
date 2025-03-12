const express = require('express');
const router = express.Router();
const db = require('../config/db');


//admin notifications
router.get('/get-admin-notifications', (req, res) => {
    const query = `
        SELECT * FROM tbl_admin_notifications
        ORDER BY created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

//update notification set to read
router.put('/admin/mark-notification-read/:id', (req, res) => {
    const notificationId = req.params.id;

    const query = `UPDATE tbl_admin_notifications SET is_read = 1 WHERE id = ?`; 

    db.query(query, [notificationId], (err, result) => {
        if (err) {
            console.error("Error marking notification as read:", err);
            return res.status(500).json({ success: false, message: 'Failed to mark as read' });
        }
        req.io.emit('update');
        res.json({ success: true, message: 'Notification marked as read' });
    })
})
router.put('/admin/mark-all-notifications-read/', (req, res) => {

    const query = `UPDATE tbl_admin_notifications SET is_read = 1`;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error marking notifications as read:", err); 
            return res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
        }    

        // Emit update event if `req.io` exists
        if (req.io) {
            req.io.emit('update');
        }

        res.json({ success: true, message: "Notifications marked as read successfully" });
    });
});

// remove notification
router.delete('/admin/remove-notification/:report_id', async (req, res) => {
    const { report_id } = req.params;
    const query = `DELETE FROM tbl_admin_notifications WHERE id = ?`;

    db.query(query, [report_id], (err, result) => {
        if (err) {
            console.error("Error deleting notifications:", err);
            return res.status(500).json({ success: false, error: "Failed to delete notifications" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "No notifications found to delete" });
        }
        req.io.emit('update');
        res.json({ success: true, message: "Notifications deleted successfully" });
        
    });
}); 



//users notifications
router.get('/get-notifications/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = `
        SELECT * FROM tbl_user_notifications WHERE user_id = ?
        ORDER BY created_at DESC`;
    db.query(query, [user_id],(err, rows) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});


//Mark notification as read
router.put('/mark-notification-read/:id', (req, res) => {

    const notificationId = req.params.id;
    const query = `UPDATE tbl_user_notifications SET is_read = 1 WHERE id = ?`;
    db.query(query, [notificationId], (err, result) => {
        if (err) {
            console.error("Error marking notification as read:", err);
            return res.status(500).json({ success: false, message: 'Failed to mark as read' });
        }
        req.io.emit('update');
        res.json({ success: true, message: 'Notification marked as read' });
    })
})


// remove notification
router.delete('/remove-notification/:report_id', async (req, res) => {
    const { report_id } = req.params;
    const query = `DELETE FROM tbl_user_notifications WHERE id = ?`;

    db.query(query, [report_id], (err, result) => {
        if (err) {
            console.error("Error deleting notifications:", err);
            return res.status(500).json({ success: false, error: "Failed to delete notifications" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "No notifications found to delete" });
        }
        req.io.emit('update');
        res.json({ success: true, message: "Notifications deleted successfully" });
        
    });
}); 


// mark all notifications as read
router.put('/mark-all-notifications-read/:user_id', (req, res) => {
    const { user_id } = req.params;

    if (!user_id) { 
        return res.status(400).json({ success: false, message: "User ID is required" });
    }    

    const query = `UPDATE tbl_user_notifications SET is_read = 1 WHERE user_id = ?`;

    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error marking notifications as read:", err); 
            return res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
        }    

        // Emit update event if `req.io` exists
        if (req.io) {
            req.io.emit('update');
        }

        res.json({ success: true, message: "Notifications marked as read successfully" });
    });
});



module.exports = router;