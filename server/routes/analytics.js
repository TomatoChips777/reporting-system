const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get reports analytics
router.get('/maintenance-analytics', async (req, res) => {
    try {
        const queries = {
            totalReports: `SELECT COUNT(*) AS total FROM tbl_reports WHERE report_type ='Maintenance Report' AND archived = 0;`,
            statusCount: `SELECT status, COUNT(*) as count FROM tbl_reports WHERE report_type ='Maintenance Report' AND archived = 0 GROUP BY status;`,

            reportsTrend: `SELECT DATE(created_at) as date, tmr.category, COUNT(*) as count 
            FROM tbl_reports r
            LEFT JOIN tbl_maintenance_reports tmr ON r.id = tmr.report_id
            WHERE r.report_type = 'Maintenance Report' AND r.archived = 0
            GROUP BY DATE(created_at), tmr.category
            ORDER BY DATE(created_at) ASC;
            `,

            reportsPerDay: `SELECT DATE(created_at) as date, COUNT(*) as count FROM tbl_reports WHERE report_type ='Maintenance Report' AND archived = 0 GROUP BY DATE(created_at)`,
            
            reportsPerMonth: `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM tbl_reports WHERE report_type ='Maintenance Report' AND archived = 0 GROUP BY DATE_FORMAT(created_at, '%Y-%m')`,
           
            issueDistribution: `SELECT tmr.category, COUNT(*) as count 
                FROM tbl_maintenance_reports tmr 
                LEFT JOIN tbl_reports r ON r.id = tmr.report_id  AND r.archived = 0
                GROUP BY tmr.category 
                ORDER BY count DESC;`,
            latestReports: `SELECT r.id, r.location, tmr.category,tmr.priority, r.status, r.created_at FROM tbl_reports r LEFT JOIN tbl_maintenance_reports tmr ON r.id = tmr.report_id WHERE r.report_type ='Maintenance Report' AND r.archived = 0 ORDER BY r.created_at DESC LIMIT 5;`
            ,
            
            resolvedPerDay: `
    SELECT DATE(updated_at) as date, COUNT(*) as count 
    FROM tbl_reports 
    WHERE report_type = 'Maintenance Report' AND status = 'resolved'  AND archived = 0
    GROUP BY DATE(updated_at)
    ORDER BY DATE(updated_at)
`,

            resolvedPerWeek: `
    SELECT YEAR(updated_at) as year, WEEK(updated_at) as week, COUNT(*) as count 
    FROM tbl_reports 
    WHERE report_type = 'Maintenance Report' AND status = 'resolved'  AND archived = 0
    GROUP BY YEAR(updated_at), WEEK(updated_at)
    ORDER BY year, week
`,

            resolvedPerMonth: `
    SELECT DATE_FORMAT(updated_at, '%Y-%m') as month, COUNT(*) as count 
    FROM tbl_reports 
    WHERE report_type = 'Maintenance Report' AND status = 'resolved' AND archived = 0
    GROUP BY DATE_FORMAT(updated_at, '%Y-%m')
    ORDER BY month
`,

            resolvedPerYear: `
    SELECT YEAR(updated_at) as year, COUNT(*) as count 
    FROM tbl_reports 
    WHERE report_type = 'Maintenance Report' AND status = 'resolved' AND archived = 0
    GROUP BY YEAR(updated_at)
    ORDER BY year
`,


        };

        let results = {};

        for (let key in queries) {
            results[key] = await new Promise((resolve, reject) => {
                db.query(queries[key], (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });
        }

        // make sure natin totalReports is extracted properly
        results.totalReports = results.totalReports?.[0]?.total || 0;

        // Transform statusCount into an object
        let statusObj = {};
        if (Array.isArray(results.statusCount)) {
            results.statusCount.forEach(row => {
                statusObj[row.status] = row.count;
            });
        }
        results.statusCount = statusObj || {};

        // Send analytics response
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch analytics", error: err });
    }
});


// Get reports analytics
router.get('/incident-analytics', async (req, res) => {
    try {
        const queries = {
            totalReports: `SELECT COUNT(*) AS total FROM tbl_reports WHERE report_type ='Incident Report' `,
            statusCount: `SELECT status, COUNT(*) as count FROM tbl_reports WHERE report_type ='Incident Report' GROUP BY status`,

            reportsTrend: `SELECT DATE(created_at) as date, tir.category, COUNT(*) as count 
            FROM tbl_reports r
            LEFT JOIN tbl_incident_reports tir ON r.id = tir.report_id
            WHERE r.report_type = 'Incident Report'
            GROUP BY DATE(created_at), tir.category
            ORDER BY DATE(created_at) ASC;
            `,

            reportsPerDay: `SELECT DATE(created_at) as date, COUNT(*) as count FROM tbl_reports WHERE report_type ='Incident Report' GROUP BY DATE(created_at)`,
            reportsPerMonth: `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM tbl_reports WHERE report_type ='Incident Report' GROUP BY DATE_FORMAT(created_at, '%Y-%m')`,
            issueDistribution: `SELECT tir.category, COUNT(*) as count 
                FROM tbl_incident_reports tir 
                LEFT JOIN tbl_reports r ON r.id = tir.report_id 
                GROUP BY tir.category 
                ORDER BY count DESC;`,
            latestReports: `SELECT r.id, r.location, tir.category,tir.priority, r.status, r.created_at FROM tbl_reports r LEFT JOIN tbl_incident_reports tir ON r.id = tir.report_id WHERE r.report_type ='Incident Report'  ORDER BY r.created_at DESC LIMIT 5;`
        };

        let results = {};

        for (let key in queries) {
            results[key] = await new Promise((resolve, reject) => {
                db.query(queries[key], (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });
        }

        // make sure natin totalReports is extracted properly
        results.totalReports = results.totalReports?.[0]?.total || 0;

        // Transform statusCount into an object
        let statusObj = {};
        if (Array.isArray(results.statusCount)) {
            results.statusCount.forEach(row => {
                statusObj[row.status] = row.count;
            });
        }
        results.statusCount = statusObj || {};

        // Send analytics response
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch analytics", error: err });
    }
});

module.exports = router;
