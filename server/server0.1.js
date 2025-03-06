const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "new_project",
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

// Create Report
app.post('/api/reports', (req, res) => {
    const { userId, location, issueType, description, imagePath } = req.body;
    const query = `INSERT INTO tbl_reports (user_id, location, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [userId, location, issueType, description, imagePath], (err, result) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }
        const reportId = result.insertId;
        db.query(`SELECT * FROM tbl_reports WHERE id = ?`, [reportId], (err, rows) => {
            if (err) {
                console.error("Error fetching report:", err);
                return res.status(500).json({ success: false, message: 'Failed to fetch report' });
            }
            res.json({ success: true, message: 'Report submitted successfully', report: rows[0] });
        });
    });
});

// Get Reports by User
app.get('/api/reports/user/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query(`SELECT * FROM tbl_reports WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

// Get All Reports
app.get('/api/reports', (req, res) => {
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

// Update Report Status
app.put('/api/reports/:reportId', (req, res) => {
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

// Delete Report
app.delete('/api/reports/:id', (req, res) => {
    const reportId = req.params.id;
    const query = `DELETE FROM tbl_reports WHERE id = ?`;
    db.query(query, [reportId], (err, result) => {
        if (err) {
            console.error("Error deleting report:", err);
            return res.status(500).json({ success: false, message: 'Failed to delete report' });
        }
        res.json({ success: true, message: 'Report deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
