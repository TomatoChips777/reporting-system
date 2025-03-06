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

router.post('/create-report', upload.single('image'), (req, res) => {
    // console.log("Received Data:", req.body);
    // console.log("Received File:", req.file);

    if (!req.body.userId || !req.body.location || !req.body.issueType || !req.body.description) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { userId, location, issueType, description } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    
    const query = `INSERT INTO tbl_reports (user_id, location, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [userId, location, issueType, description, imagePath], (err, result) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }
        res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
    });
});

// Create Report
// router.post('/create-report', upload.single('image'), (req, res) => {
//     const { userId, location, issueType, description } = req.body;
//     const imagePath = req.file ? req.file.filename : null;
    
//     const query = `INSERT INTO tbl_reports (user_id, location, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)`;
//     db.query(query, [userId, location, issueType, description, imagePath], (err, result) => {
//         if (err) {
//             console.error("Error creating report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to submit report' });
//         }
//         res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
//     });
// });

// Update Report
// router.put('/:reportId', upload.single('image'), (req, res) => {
//     const { reportId } = req.params;
//     const { userId, location, issueType, description, existingImagePath } = req.body;
//     const newImage = req.file ? req.file.filename : existingImagePath;
    
//     if (req.file && existingImagePath) {
//         const oldImagePath = path.join('uploads', existingImagePath);
//         if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//         }
//     }
    
//     const query = `UPDATE tbl_reports SET location = ?, issue_type = ?, description = ?, image_path = ? WHERE id = ? AND user_id = ?`;
//     db.query(query, [location, issueType, description, newImage, reportId, userId], (err, result) => {
//         if (err) {
//             console.error("Error updating report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to update report' });
//         }
//         res.json({ success: true, message: 'Report updated successfully' });
//     });
// });

router.put('/:reportId', upload.single('image'), (req, res) => {
    const { reportId } = req.params;
    const { userId, location, issueType, description } = req.body;
    const newImage = req.file ? req.file.filename : null;

    // Fetch the current image path from the database
    const getImageQuery = `SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?`;
    db.query(getImageQuery, [reportId, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching existing image:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch report" });
        }

        const existingImagePath = rows[0]?.image_path;

        // Delete old image if a new one is uploaded
        if (newImage && existingImagePath) {
            const oldImagePath = path.join('uploads', existingImagePath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update report with new data and image path
        const query = `UPDATE tbl_reports SET location = ?, issue_type = ?, description = ?, image_path = ? WHERE id = ? AND user_id = ?`;
        db.query(query, [location, issueType, description, newImage || existingImagePath, reportId, userId], (err, result) => {
            if (err) {
                console.error("Error updating report:", err);
                return res.status(500).json({ success: false, message: "Failed to update report" });
            }
            res.json({ success: true, message: "Report updated successfully" });
        });
    });
});


// // Delete Report
// router.delete('/:id', (req, res) => {
//     const { id, userId } = req.params;
    
//     db.query('SELECT image_path FROM tbl_reports WHERE id = ?', [id], (err, rows) => {
//         if (err) {
//             console.error("Error fetching report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to fetch report' });
//         }
//         const imagePath = rows[0]?.image_path;
        
//         if (imagePath) {
//             const filePath = path.join('uploads', imagePath);
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//         }
        
//         db.query('DELETE FROM tbl_reports WHERE id = ?', [id], (err) => {
//             if (err) {
//                 console.error("Error deleting report:", err);
//                 return res.status(500).json({ success: false, message: 'Failed to delete report' });
//             }
//             res.json({ success: true, message: 'Report deleted successfully' });
//         });
//     });
// });

// Delete Report (Ensure the user is authorized)
// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     const { userId } = req.body; // Get userId from request body

//     if (!userId) {
//         return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     // Check if the report belongs to the user before deleting
//     db.query('SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err, rows) => {
//         if (err) {
//             console.error("Error fetching report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to fetch report' });
//         }
//         if (rows.length === 0) {
//             return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
//         }

//         const imagePath = rows[0].image_path;
//         if (imagePath) {
//             const filePath = path.join('uploads', imagePath);
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//         }

//         db.query('DELETE FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err) => {
//             if (err) {
//                 console.error("Error deleting report:", err);
//                 return res.status(500).json({ success: false, message: 'Failed to delete report' });
//             }
//             res.json({ success: true, message: 'Report deleted successfully' });
//         });
//     });
// });

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
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
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});


// Get All Reports
router.get('/', (req, res) => {
    const query = `
        SELECT r.*, u.name as reporter_name 
        FROM tbl_reports r 
        JOIN tbl_users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM tbl_reports WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});


// Update Report Status
router.put('/admin/edit/:reportId', (req, res) => {
    const reportId = req.params.reportId;
    const { status } = req.body;
    const query = `UPDATE tbl_reports SET status = ? WHERE id = ?`;
    db.query(query, [status, reportId], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);
            return res.status(500).json({ success: false, message: 'Failed to update status' });
        }
        res.json({ success: true, message: 'Status updated successfully' });
    });
});

module.exports = router;
