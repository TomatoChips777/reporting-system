const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { use } = require('react');

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
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads'));

/**
 * @route POST /create-lost-found
 * @desc Create a new lost or found item
 */
router.post('/create-lost-found', upload.single('image_path'), (req, res) => {
    try {

        const { user_id, type, item_name, category, description, location, contact_info, is_anonymous } = req.body;
        const image_path = req.file ? req.file.filename : null;
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
                // $message = "New report submitted {$issueType} issue at {$location}";
                const title = "Lost And Found Report";
                const message = `A new ${type} item "${item_name}" has been reported at ${location}.`;

                const notificationQuery = `INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) VALUES (?, ?, ?, ?)`;

                db.query(notificationQuery, [result.insertId, user_id, message, title], (err, notificationResult) => {
                    if (err) {
                        console.error("Error creating notification:", err);
                        return res.status(500).json({ success: false, message: 'Failed to create notification' });
                    }
                });
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

/**
 * @route GET /items
 * @desc Fetch all lost and found items with user names (or "Anonymous" if set)
 */
router.get('/items', (req, res) => {
    const query = `
        SELECT 
            lf.*,
            CASE 
                WHEN lf.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS user_name
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id where lf.archived = 0
        ORDER BY lf.date_reported DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        res.json({
            success: true,
            items: results
        });
    });
});




router.get('/user/items/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT 
            lf.*,
            CASE 
                WHEN lf.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS user_name
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id WHERE user_id = ? AND lf.archived = 0
        ORDER BY lf.date_reported DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, items: rows });
    });
});

/**
 * @route GET /items/:id
 * @desc Fetch a single lost/found item by ID
 */
router.get('/items/:id', (req, res) => {
    const query = `
        SELECT 
            lf.*,
            CASE 
                WHEN lf.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS user_name
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id
        WHERE lf.id = ?
    `;

    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            item: result[0]
        });
    });
});

/**
 * @route PUT /items/:id/status
 * @desc Update item status (e.g., open → claimed)
 */
router.put('/items/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['open', 'closed', 'claimed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be one of: open, closed, claimed'
        });
    }

    const query = 'UPDATE tbl_lost_found SET status = ? WHERE id = ?';

    db.query(query, [status, req.params.id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Emit socket event if available
        if (req.io) {
            req.io.emit('updateStatus', {
                id: req.params.id,
                status
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    });
});

/**
 * @route DELETE /items/:id
 * @desc Delete a lost/found item
 */
router.delete('/items/:id', (req, res) => {
    // First get the item to check if it has an image
    const getImageQuery = 'SELECT image_path FROM tbl_lost_found WHERE id = ?';

    db.query(getImageQuery, [req.params.id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Delete the item from database
        const deleteQuery = 'DELETE FROM tbl_lost_found WHERE id = ?';
        db.query(deleteQuery, [req.params.id], async (err, deleteResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            // Delete associated image if it exists
            if (result[0].image_path) {
                const imagePath = path.join('uploads', result[0].image_path);
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (error) {
                    console.error('Error deleting image file:', error);
                }
            }

            // Emit socket event if available
            if (req.io) {
                req.io.emit('deletedItem', {
                    id: req.params.id
                });
            }

            res.json({
                success: true,
                message: 'Item deleted successfully'
            });
        });
    });
});

router.put('/items/:id', upload.single('image_path'), (req, res) => {
    const { id } = req.params;
    const { user_id, type, item_name, category, description, location, status, contact_info, is_anonymous } = req.body;
    const image_path = req.file ? req.file.filename : null;

    const getImageQuery = 'SELECT image_path FROM tbl_lost_found WHERE id = ?';

    db.query(getImageQuery, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch error'
            });
        }

        const exisntingImagePath = result[0].image_path;

        if (image_path && exisntingImagePath) {
            const oldImagePath = path.join('uploads', exisntingImagePath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
    })

    const updateQuery = `UPDATE tbl_lost_found SET user_id = ?,
     type = ?, item_name = ?, category = ?, description = ?, 
    location = ?, status = ?, contact_info = ?, is_anonymous = ? 
    WHERE id = ?`;

    db.query(updateQuery, [user_id, type, item_name, category, description, location, status, contact_info, is_anonymous, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        // Emit socket event if available
        if (req.io) {
            req.io.emit('update');
            req.io.emit('updatedItem', {
                id,
                user_id,
                type,
                item_name,
                category,
                description,
                location,
                status,
                contact_info,
                is_anonymous
            });
        }

        res.json({
            success: true,
            message: 'Item updated successfully'
        });
    });

})

router.post('/claim-item/:id',upload.single('image'), (req, res) => {
    const { id } = req.params;  // Get item ID from the URL params
    const { user_id, description, contact_info } = req.body;  // Get claim data from the request body
    const image = req.file ? req.file.filename : null;

    // SQL query to insert a new claim
    const claimQuery = 'INSERT INTO tbl_claim_items (item_id, user_id, description, contact_info, image) VALUES (?, ?, ?, ?, ?)';

    db.query(claimQuery, [id, user_id, description, contact_info, image], (err, result) => {
        if (err) {
            console.error('Database error:', err);  // Log the error for debugging
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err,  // Include the error message in the response for debugging
            });
        }


                const title = "Lost And Found Report";
                const message = `A new ${type} item "${item_name}" has been reported at ${location}.`;

                const notificationQuery = `INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) VALUES (?, ?, ?, ?)`;

                db.query(notificationQuery, [id, user_id, message, title], (err, notificationResult) => {
                    if (err) {
                        console.error("Error creating notification:", err);
                        return res.status(500).json({ success: false, message: 'Failed to create notification' });
                    }
                });
        // Emit the update event (if using sockets)
        req.io.emit('update');
        
        // Respond with a success message
        res.json({
            success: true,
            message: 'Item claimed successfully',
        });
    });
});


router.post('/found-item/:id',upload.single('image'), (req, res) => {
    const { id } = req.params;  // Get item ID from the URL params
    const { user_id, location, description } = req.body;  // Get claim data from the request body
    const image = req.file ? req.file.filename : null;

    // SQL query to insert a new claim
    const claimQuery = 'INSERT INTO tbl_found_items (item_id, user_id, location, description, image) VALUES (?, ?, ?, ?, ?)';

    db.query(claimQuery, [id, user_id, location, description, image], (err, result) => {
        if (err) {
            console.error('Database error:', err);  // Log the error for debugging
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err,  // Include the error message in the response for debugging
            });
        }

        // Emit the update event (if using sockets)
        req.io.emit('update');
        
        // Respond with a success message
        res.json({
            success: true,
            message: 'Item claimed successfully',
        });
    });
});

module.exports = router;