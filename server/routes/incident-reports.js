const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Not implemented
router.delete('/admin/report/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin') {
        return res.status(400).json({ success: false, message: `Unauthorized: You cannot delete this report` });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);

            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ?', [id], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            req.io.emit('reportDeleted', { reportId: id });
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});

// Not implemented
router.delete('/report/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: `User ID is required ${userId}` });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);

            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            req.io.emit('update');
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});
// Not implemented
router.put('/reports/archive-maintenance-report/:id', (req, res) => {
    const { id } = req.params;
    const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error archiving report:", err);
            return res.status(500).json({ success: false, message: "Error archiving report" });
        }
        req.io.emit('update');
        res.json({ success: true, message: "Report archived successfully" });   
    })
    
});
//Not Implemented
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM tbl_reports WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});
//Not Implemented
router.put("/admin/edit-report-type/:reportId", (req, res) => {
    const { report_type, category, priority, assigned_staff, status, type, item_name, contact_info, sender_id, location,description, } = req.body;
    const { reportId } = req.params;
    const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";

    db.query(updateReportQuery, [report_type, reportId], (err, result) => {
        if (err) {
            console.error("Error updating report type:", err);
            return res.status(500).json({ success: false, message: "Failed to update report type" });
        }

        if (report_type === "Maintenance Report") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff, status) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                category = ?, priority = ?, assigned_staff = ?, status = ?`;

            db.query(
                maintenanceQuery,
                [reportId, category, priority, assigned_staff, status, category, priority, assigned_staff, status],
                (err, maintenanceResult) => {
                    if (err) {
                        console.error("Error updating maintenance report:", err);
                        return res.status(500).json({ success: false, message: "Failed to update maintenance report" });
                    }
                    req.io.emit('update'); // Notify frontend
                    res.json({ success: true, message: "Report updated successfully" });
                }
            );
        } else if (report_type === "Lost And Found") {
            const lostFoundQuery = `
                INSERT INTO tbl_lost_found (user_id, report_id, type, category, location, description, item_name, contact_info) 
                VALUES (?, ?, ?, ?, ?, ? , ? , ?) 
                ON DUPLICATE KEY UPDATE 
                type = ?, item_name = ?, contact_info = ?`;

            db.query(
                lostFoundQuery,
                [sender_id ,reportId, type,category, location, description, item_name, contact_info, type, item_name, contact_info],
                (err, lostFoundResult) => {
                    if (err) {
                        console.error("Error updating lost and found report:", err);
                        return res.status(500).json({ success: false, message: "Failed to update lost and found report" });
                    }
                    req.io.emit('update'); // Notify frontend
                    res.json({ success: true, message: "Report updated successfully" });
                }
            );
        } else {
            req.io.emit('update'); // Notify frontend
            res.json({ success: true, message: "Report type updated successfully" });
        }
    });
});


// Fetching all the incident-reports
router.get('/', (req, res) => {
    const query = `
        SELECT 
            r.*, 
            --u.name AS reporter_name, 
              CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name,
            tir.report_id,
            tir.category AS incident_category, 
            tir.priority, 
            tir.assigned_staff, 
            r.status
        FROM tbl_reports r
        JOIN tbl_users u ON r.user_id = u.id
        LEFT JOIN tbl_incident_reports tir ON r.id = tir.report_id
        WHERE r.archived = 0  and r.report_type = 'Incident Report'
        ORDER BY r.created_at DESC`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
        res.json({ success: true, reports: rows });
    });
});

// Updating the status to track the report
router.put('/admin/edit/:reportId', (req, res) => {
    const reportId = req.params.reportId;
    const { status } = req.body;

    const getUserQuery = `SELECT r.user_id, r.location, tir.category FROM tbl_reports r LEFT JOIN tbl_incident_reports tir ON r.id = tir.report_id WHERE r.id = ?`;

    db.query(getUserQuery, [reportId], (err, result) => {
        if (err) {
            console.error("Error retrieving report details:", err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve report details' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        const { user_id, location, category } = result[0];

        const updateQuery = `UPDATE tbl_reports SET status = ? WHERE id = ?`;

        db.query(updateQuery, [status, reportId], (err, updateResult) => {
            if (err) {
                console.error("Error updating status:", err);
                return res.status(500).json({ success: false, message: 'Failed to update status' });
            }

            const title = "Incident Report";
            const formattedStatus = req.body.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const message = `Your report about ${category} at ${location} has been marked as "${formattedStatus}".`;
            const notificationQuery = `INSERT INTO tbl_user_notifications (report_id, user_id, message, title) VALUES (?, ?, ?, ?)`;

            db.query(notificationQuery, [reportId, user_id, message, title], (err, notificationResult) => {
                if (err) {
                    console.error("Error creating notification:", err);
                    return res.status(500).json({ success: false, message: 'Failed to create notification' });
                }

                req.io.emit('updatedStatus', { reportId, status });
                req.io.emit('update');

                res.json({ success: true, message: 'Status updated successfully' });
            });
        });
    });
});

module.exports = router;
