const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


router.get("/user-reports/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const maintenanceQuery = `SELECT id, user_id, location, issue_type AS title, description, image_path, status, created_at AS date_reported, 'maintenance'
         AS report_type FROM tbl_reports WHERE user_id = ? AND archived = 0`;
        db.query(maintenanceQuery, [userId], (err, maintenanceReports) => {
            if (err) {
                console.error("Error fetching maintenance reports:", err);
                return res.status(500).json({ message: "Error fetching maintenance reports" });
            }
            const lostFoundQuery = `SELECT id, user_id, location, item_name AS title, category, is_anonymous, description, image_path, status,
             date_reported,contact_info,type AS report_type FROM tbl_lost_found WHERE user_id = ? AND archived = 0`;

            // const lostFoundQuery = `SELECT id, user_id, location, item_name AS title, description, image_path, status, date_reported, type AS report_type FROM tbl_lost_found WHERE user_id = ?`;
            db.query(lostFoundQuery, [userId], (err, lostFoundReports) => {
                if (err) {
                    console.error("Error fetching lost & found reports:", err);
                    return res.status(500).json({ message: "Error fetching lost & found reports" });
                }

                // Assign unique IDs by appending the report type to the ID
                const combinedReports = [
                    ...maintenanceReports.map(report => ({ ...report, unique_id: `maintenance-${report.id}` })),
                    ...lostFoundReports.map(report => ({ ...report, unique_id: `lostfound-${report.id}` }))
                ];

                // Sort by date (latest first)
                combinedReports.sort((a, b) => new Date(b.date_reported) - new Date(a.date_reported));

                res.json({ reports: combinedReports });
            });
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports" });
    }
});


router.put('/reports/archive-maintenance-report/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE tbl_reports SET archived = 1 WHERE id = ?", [id]);
        // await db.query("UPDATE tbl_lost_found SET archived = 1 WHERE id = ?", [id]);
        res.json({ success: true, message: "Report archived successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error archiving report" });
    }
});

router.put('/reports/archive-lost-found-report/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await db.query("UPDATE tbl_reports SET archived = 1 WHERE id = ?", [id]);
        await db.query("UPDATE tbl_lost_found SET archived = 1 WHERE id = ?", [id]);
        res.json({ success: true, message: "Report archived successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error archiving report" });
    }
});



router.post('/create-lost-found', upload.single('image_path'), (req, res) => {
    try {
        
        const { user_id, type, item_name, category, description, location, contact_info, is_anonymous,image_path } = req.body;
        const status = 'open'; // Default status for new items

        if (!user_id || !type || !item_name || !category || !location) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: user_id, type, item_name, category, and location are required" 
            });
        }

        const query = `
            INSERT INTO tbl_lost_found (
                user_id, type, item_name, category, description, 
                location, status, image_path, contact_info, is_anonymous
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query, 
            [user_id, type, item_name, category, description, location, status, image_path, contact_info, is_anonymous],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                // Emit socket events if available
                if (req.io) {
                    req.io.emit('update');
                    req.io.emit('createdReport', { 
                        id: result.insertId, 
                        item_name, 
                        type 
                    });
                }

                res.json({ 
                    success: true, 
                    message: 'Item posted successfully', 
                    itemId: result.insertId 
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});



router.post('/create-report', upload.single('image_path'), (req, res) => {

    if (!req.body.user_id || !req.body.location || !req.body.issue_type || !req.body.description) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { user_id, location, issue_type, description, image_path } = req.body;
    

    const query = `INSERT INTO tbl_reports (user_id, location, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [user_id, location, issue_type, description, image_path], (err, result) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }
        // const newReport = { id: result.insertId, user_id, location, issue_type, description ,status: 'pending'};
        const newReport = {
            id: result.insertId,
            user_id,
            location,
            issue_type,
            description,
            status: "pending",  // Initially set to 'pending'
            image_path: image_path || null // set image path if not null or null
        };
        // $message = "New report submitted {$issueType} issue at {$location}";
        const title = "Maintenance Report";
        const message = `New report submitted ${issue_type} issue at ${location}`;
        const notificationQuery = `INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) VALUES (?, ?, ?, ?)`;

        db.query(notificationQuery, [result.insertId, user_id, message, title], (err, notificationResult) => {
            if (err) {
                console.error("Error creating notification:", err);
                return res.status(500).json({ success: false, message: 'Failed to create notification' });
            }
        });
        req.io.emit('update');
        req.io.emit('createdReport', newReport);
        res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
    });
});
module.exports = router;
