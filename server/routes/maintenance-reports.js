const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


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
            // req.io.emit('reportDeleted', { reportId: id });
            req.io.emit('update');
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});

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

router.get('/', (req, res) => {
    const query = `
        SELECT 
            mr.*, 
            u.name AS reporter_name, 
            tmr.category AS maintenance_category, 
            tmr.priority, 
            tmr.assigned_staff, 
            mr.status 
        FROM tbl_reports mr
        JOIN tbl_users u ON mr.user_id = u.id
        LEFT JOIN tbl_maintenance_reports tmr ON mr.id = tmr.report_id
        WHERE mr.archived = 0  and mr.report_type = 'Maintenance Report'
        ORDER BY mr.created_at DESC;`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
        res.json({ success: true, reports: rows });
    });
});



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



router.put('/admin/edit/:reportId', (req, res) => {
    const reportId = req.params.reportId;
    const { status } = req.body;

    // Step 1: Retrieve the user_id associated with this report
    const getUserQuery = `SELECT user_id, location FROM tbl_reports WHERE id = ?`;

    db.query(getUserQuery, [reportId], (err, result) => {
        if (err) {
            console.error("Error retrieving report details:", err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve report details' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        const { user_id, location } = result[0];

        const updateQuery = `UPDATE tbl_reports SET status = ? WHERE id = ?`;

        db.query(updateQuery, [status, reportId], (err, updateResult) => {
            if (err) {
                console.error("Error updating status:", err);
                return res.status(500).json({ success: false, message: 'Failed to update status' });
            }

           
                req.io.emit('updatedStatus', { reportId, status });
                req.io.emit('update');

                res.json({ success: true, message: 'Status updated successfully' });
        });
    });
});


router.put("/admin/edit-report-type/:reportId", (req, res) => {
    const { report_type, category, priority, assigned_staff, status, type, item_name, contact_info, sender_id, location,description, } = req.body;
    const { reportId } = req.params;
    // Update `tbl_reports` first
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


module.exports = router;
