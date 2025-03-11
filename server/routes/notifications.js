const express = require('express');
const router = express.Router();
const db = require('../config/db');


//admin notifications
router.get('/get-admin-notifications', (req, res) => {
    const query = `
        SELECT * FROM tbl_admin_notifications WHERE is_read = 0
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

module.exports = router;