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
// router.post('/create-lost-found', upload.single('image_path'), (req, res) => {
//     try {

//         const { user_id, type, item_name, category, description, location, contact_info, is_anonymous } = req.body;
//         const image_path = req.file ? req.file.filename : null;
//         const status = 'open'; // Default status for new items

//         if (!user_id || !type || !item_name || !category || !location) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields: user_id, type, item_name, category, and location are required"
//             });
//         }

//         const query = `
//             INSERT INTO tbl_lost_found (
//                 user_id, type, item_name, category, description, 
//                 location, status, image_path, contact_info, is_anonymous
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         db.query(
//             query,
//             [user_id, type, item_name, category, description, location, status, image_path, contact_info, is_anonymous],
//             (err, result) => {
//                 if (err) {
//                     console.error('Database error:', err);
//                     return res.status(500).json({ success: false, message: 'Database error' });
//                 }
//                 // $message = "New report submitted {$issueType} issue at {$location}";
//                 const title = "Lost And Found Report";
//                 const message = `A new ${type} item "${item_name}" has been reported at ${location}.`;

//                 const notificationQuery = `INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) VALUES (?, ?, ?, ?)`;

//                 db.query(notificationQuery, [result.insertId, user_id, message, title], (err, notificationResult) => {
//                     if (err) {
//                         console.error("Error creating notification:", err);
//                         return res.status(500).json({ success: false, message: 'Failed to create notification' });
//                     }
//                 });
//                 // Emit socket events if available
//                 if (req.io) {
//                     req.io.emit('update');
//                     req.io.emit('createdReport', {
//                         id: result.insertId,
//                         item_name,
//                         type
//                     });
//                 }

//                 res.json({
//                     success: true,
//                     message: 'Item posted successfully',
//                     itemId: result.insertId
//                 });
//             }
//         );
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });


router.post('/create-lost-found', upload.single('image_path'), (req, res) => {
    if (!req.body.user_id || !req.body.location || !req.body.description || !req.body.item_name) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { user_id, location, description, type, item_name, category, contact_info, is_anonymous } = req.body;
    const image_path = req.file ? req.file.filename : null;
    const report_type = "Lost And Found";
    // Insert into tbl_reports first
    const reportQuery = `INSERT INTO tbl_reports (user_id, report_type, location, description, image_path, is_anonymous, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(reportQuery, [user_id, report_type, location, description, image_path, is_anonymous, 'in_progress'], (err, reportResult) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }

        const report_id = reportResult.insertId;

        // Insert into tbl_lost_found using the report_id
        const lostFoundQuery = `
            INSERT INTO tbl_lost_found (user_id, report_id, type, item_name, category, description, location, image_path, contact_info, is_anonymous) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(lostFoundQuery, [user_id, report_id, type, item_name, category, description, location, image_path, contact_info, is_anonymous], (err, lostFoundResult) => {
            if (err) {
                console.error("Error inserting lost & found record:", err);
                return res.status(500).json({ success: false, message: 'Failed to submit lost and found item' });
            }

            req.io.emit('update');
            res.json({ success: true, message: 'Lost & Found item submitted successfully', reportId: report_id });
        });
    });
});


/**
 * @route GET /items
 * @desc Fetch all lost and found items with user names (or "Anonymous" if set)
 */
// router.get('/items', (req, res) => {
//     const query = `
//         SELECT 
//     lf.*,
//     CASE 
//         WHEN lf.is_anonymous = 1 THEN 'Anonymous'
//         ELSE u.name 
//     END AS user_name
// FROM tbl_lost_found lf
// LEFT JOIN tbl_users u ON lf.user_id = u.id 
// LEFT JOIN tbl_reports r ON lf.report_id = r.id
// WHERE lf.archived = 0
//     AND COALESCE(r.report_type, '') != ''
// ORDER BY lf.date_reported DESC;

//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database error'
//             });
//         }

//         res.json({
//             success: true,
//             items: results
//         });
//     });
// });
router.get('/items', (req, res) => {
    const query = `
        SELECT 
            lf.*,
            r.created_at,
            CASE 
                WHEN lf.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS user_name,
            COUNT(c.id) AS claim_count
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id 
        LEFT JOIN tbl_reports r ON lf.report_id = r.id
        LEFT JOIN tbl_claims c ON c.item_id = lf.id  -- Join with tbl_claims to count claims
        WHERE lf.archived = 0
            AND COALESCE(r.report_type, '') != '' AND lf.status = 'open'
        GROUP BY lf.id, u.name  -- Group by lf.id to get the count of claims per item
        ORDER BY lf.date_reported DESC;
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
router.put('/items/status-change/:id', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['open', 'closed', 'claimed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be one of: open, closed, claimed'
        });
    }

    // Map lost_found status to reports status
    const statusMap = {
        open: 'pending',
        closed: 'resolved',
        claimed: 'resolved'
    };
    const mappedReportStatus = statusMap[status];

    const updateLostFoundQuery = 'UPDATE tbl_lost_found SET status = ? WHERE id = ?';

    db.query(updateLostFoundQuery, [status, req.params.id], (err, result) => {
        if (err) {
            console.error('Database error (lost_found):', err);
            return res.status(500).json({
                success: false,
                message: 'Database error on lost & found update'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lost & found item not found'
            });
        }

        const updateReportQuery = 'UPDATE tbl_reports SET status = ? WHERE reference_id = ? AND category = "lost_found"';

        db.query(updateReportQuery, [mappedReportStatus, req.params.id], (err, reportResult) => {
            if (err) {
                console.error('Database error (reports):', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error on reports update'
                });
            }

            // Emit socket event if needed
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
});
router.get('/claims/:itemId', (req, res) => {
    const itemId = req.params.itemId;

    const query = `
        SELECT 
            c.*, 
            claimer.name AS claimer_name,
            holder.name AS holder_name
        FROM tbl_claims c
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.item_id = ?
    `;
    db.query(query, [itemId], (err, results) => {
        if (err) {
            console.error('Error fetching claims:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, claims: results });
    });
});

router.get('/claimed-items/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const query = `
        SELECT 
            c.*, 
            claimer.name AS claimer_name,
            holder.name AS holder_name
        FROM tbl_claims c
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.item_id = ?
    `;
    db.query(query, [itemId], (err, results) => {
        if (err) {
            console.error('Error fetching claims:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, claims: results });
    });
});


router.get('/item/claims', (req, res) => {
    const query = `
        SELECT 
            c.*, 
            claimer.name AS claimer_name,
            holder.name AS holder_name
        FROM tbl_claims c
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.status = 'accepted'
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching claims:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, claims: results });
    });
});


// router.put('/items/status-change/:id', (req, res) => {
//     const { status } = req.body;
//     const validStatuses = ['open', 'closed', 'claimed'];

//     if (!validStatuses.includes(status)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid status. Must be one of: open, closed, claimed'
//         });
//     }

//     const query = 'UPDATE tbl_lost_found SET status = ? WHERE id = ?';

//     db.query(query, [status, req.params.id], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database error'
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Item not found'
//             });
//         }

//         const reportStatusQuery = 'UPDATE tbl_reports SET status = ? WHERE id = ?';

//         db.query(reportStatusQuery, [status, req.params.id], (err, result) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return res.status(500).json({
//                     success: false, message: 'Database error'
//                 });
//             }
//         });
//         // Emit socket event if available
//         if (req.io) {
//             req.io.emit('updateStatus', {
//                 id: req.params.id,
//                 status
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Status updated successfully'
//         });
//     });
// });

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

    // Get the existing lost_found item to fetch report_id and old image path
    const getItemQuery = `SELECT report_id, image_path FROM tbl_lost_found WHERE id = ?`;

    db.query(getItemQuery, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch item' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const { report_id, image_path: existingImagePath } = result[0];

        // Remove old image if a new one is uploaded
        if (image_path && existingImagePath) {
            const oldImagePath = path.join('uploads', existingImagePath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update tbl_reports first
        const updateReportQuery = `UPDATE tbl_reports SET location = ?, description = ?, image_path = ?, is_anonymous = ? WHERE id = ?`;
        db.query(updateReportQuery, [location, description, image_path || existingImagePath, is_anonymous, report_id], (err, reportResult) => {
            if (err) {
                console.error('Database error updating report:', err);
                return res.status(500).json({ success: false, message: 'Failed to update report' });
            }

            // Now update tbl_lost_found
            const updateLostFoundQuery = `
                UPDATE tbl_lost_found SET 
                type = ?, item_name = ?, category = ?, description = ?, 
                location = ?, status = ?, contact_info = ?, is_anonymous = ? , image_path = ?
                WHERE id = ?`;

            db.query(updateLostFoundQuery, [type, item_name, category, description, location, status, contact_info, is_anonymous, image_path || existingImagePath, id], (err, lostFoundResult) => {
                if (err) {
                    console.error('Database error updating lost & found:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update lost and found item' });
                }

                // Emit socket event if available
                if (req.io) {
                    req.io.emit('update');
                    req.io.emit('updatedItem', {
                        id,
                        report_id,
                        user_id,
                        type,
                        item_name,
                        category,
                        description,
                        location,
                        status,
                        contact_info,
                        is_anonymous,
                        image_path: image_path || existingImagePath
                    });
                }

                res.json({ success: true, message: 'Item updated successfully' });
            });
        });
    });
});

// router.put('/items/:id', upload.single('image_path'), (req, res) => {
//     const { id } = req.params;
//     const { user_id, type, item_name, category, description, location, status, contact_info, is_anonymous } = req.body;
//     const image_path = req.file ? req.file.filename : null;

//     const getImageQuery = 'SELECT image_path FROM tbl_lost_found WHERE id = ?';

//     db.query(getImageQuery, [id], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch error'
//             });
//         }

//         const exisntingImagePath = result[0].image_path;

//         if (image_path && exisntingImagePath) {
//             const oldImagePath = path.join('uploads', exisntingImagePath);
//             if (fs.existsSync(oldImagePath)) {
//                 fs.unlinkSync(oldImagePath);
//             }
//         }
//     })

//     const updateQuery = `UPDATE tbl_lost_found SET 
//      type = ?, item_name = ?, category = ?, description = ?, 
//     location = ?, status = ?, contact_info = ?, is_anonymous = ? 
//     WHERE id = ?`;

//     db.query(updateQuery, [type, item_name, category, description, location, status, contact_info, is_anonymous, id], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database error'
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Item not found'
//             });
//         }
//         // Emit socket event if available
//         if (req.io) {
//             req.io.emit('update');
//             req.io.emit('updatedItem', {
//                 id,
//                 user_id,
//                 type,
//                 item_name,
//                 category,
//                 description,
//                 location,
//                 status,
//                 contact_info,
//                 is_anonymous
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Item updated successfully'
//         });
//     });

// })

router.post('/claim-item/:id', upload.single('image'), (req, res) => {
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


router.post('/found-item/:id', upload.single('image'), (req, res) => {
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

router.post('/item/claim-request', (req, res) => {
    const { itemId, claimerId, holderId, description } = req.body;

    // First check if the claim already exists
    const checkQuery = `
        SELECT * FROM tbl_claims 
        WHERE item_id = ? AND claimer_id = ?
    `;

    db.query(checkQuery, [itemId, claimerId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking existing claim:', checkErr);
            return res.status(500).json({
                success: false,
                message: 'Error checking existing claim'
            });
        }

        if (checkResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already sent a claim request for this item'
            });
        }

        // If not exists, insert the new claim
        const insertQuery = `
            INSERT INTO tbl_claims (item_id, claimer_id, holder_id, description)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, [itemId, claimerId, holderId, description], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error inserting claim request:', insertErr);
                return res.status(500).json({
                    success: false,
                    message: 'Error inserting claim request'
                });
            }

            return res.json({
                success: true,
                message: 'Claim request sent successfully'
            });
        });
    });
});

// router.put('/item/accept-claim', (req, res) => {
//     // const { itemId } = req.params;
//     const {item_id, holder_id, claimer_id } = req.body;  // Retrieve from request body

//     if (!item_id || !holder_id || !claimer_id) {
//         return res.status(400).json({
//             success: false,
//             message: 'Missing item_id, holder_id, or claimer_id'
//         });
//     }

//     const query = `
//         UPDATE tbl_claims 
//         SET status = 'accepted' 
//         WHERE item_id = ? AND holder_id = ? AND claimer_id = ?
//     `;

//     db.query(query, [item_id, holder_id, claimer_id], (err, result) => {
//         if (err) {
//             console.error('Error accepting claim:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Error accepting claim'
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No matching claim found to update'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Claim accepted successfully'
//         });
//     });
// });



router.put('/item/accept-claim', (req, res) => {
    const { item_id, holder_id, claimer_id } = req.body;  // Retrieve from request body

    if (!item_id || !holder_id || !claimer_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing item_id, holder_id, or claimer_id'
        });
    }

    // Start a transaction to ensure all updates happen atomically
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({
                success: false,
                message: 'Error starting transaction'
            });
        }

        // Update claim status to 'accepted'
        const updateClaimQuery = `
            UPDATE tbl_claims 
            SET status = 'accepted' 
            WHERE item_id = ? AND holder_id = ? AND claimer_id = ?
        `;

        db.query(updateClaimQuery, [item_id, holder_id, claimer_id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error updating claim:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating claim'
                    });
                });
            }

            // If no claim was found to update, rollback and respond with an error
            if (result.affectedRows === 0) {
                return db.rollback(() => {
                    return res.status(404).json({
                        success: false,
                        message: 'No matching claim found to update'
                    });
                });
            }

            // Update tbl_lost_found status to 'claimed'
            const updateLostFoundQuery = `
                UPDATE tbl_lost_found
                SET status = 'claimed'
                WHERE id = ?
            `;
            db.query(updateLostFoundQuery, [item_id], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error updating tbl_lost_found status:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating tbl_lost_found status'
                        });
                    });
                }

                // Fetch the report_id from tbl_lost_found (because it references tbl_reports)
                const fetchReportIdQuery = `
                    SELECT report_id 
                    FROM tbl_lost_found 
                    WHERE id = ?
                `;
                db.query(fetchReportIdQuery, [item_id], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error fetching report_id from tbl_lost_found:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Error fetching report_id from tbl_lost_found'
                            });
                        });
                    }

                    if (result.length === 0) {
                        return db.rollback(() => {
                            console.error('No report found for this item');
                            return res.status(404).json({
                                success: false,
                                message: 'No report found for this item'
                            });
                        });
                    }

                    const reportId = result[0].report_id;

                    // Update tbl_reports status to 'resolved'
                    const updateReportsQuery = `
                        UPDATE tbl_reports
                        SET status = 'resolved'
                        WHERE id = ?
                    `;
                    db.query(updateReportsQuery, [reportId], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error updating tbl_reports status:', err);
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error updating tbl_reports status'
                                });
                            });
                        }

                        // Commit the transaction if everything is successful
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Error committing transaction'
                                    });
                                });
                            }

                            // Respond with success if everything was updated successfully
                            res.json({
                                success: true,
                                message: 'Claim accepted and statuses updated successfully'
                            });
                        });
                    });
                });
            });
        });
    });
});


// // Route to handle the claim request
// router.post('/item/claim-request', (req, res) => {
//     const { item_id, claimerId, holderId } = req.body;

//     // Insert a new claim into the tbl_claims table
//     const query = `
//         INSERT INTO tbl_claims (item_id, claimer_id, holder_id)
//         VALUES (?, ?, ?)
//     `;

//     db.query(query, [itemId, claimerId, holderId], (err, result) => {
//         if (err) {
//             console.error('Error inserting claim request:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Error inserting claim request'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Claim request sent successfully'
//         });
//     });
// });


router.get("/analytics", (req, res) => {
    const summaryQuery = `
    SELECT 'lost' AS type, COUNT(*) AS count
    FROM tbl_lost_found
    WHERE type = 'lost' AND archived = 0

    UNION ALL

    SELECT 'found' AS type, COUNT(*) AS count
    FROM tbl_lost_found
    WHERE type = 'found' AND archived = 0

    UNION ALL

    SELECT 'claimed' AS type, COUNT(*) AS count
    FROM tbl_lost_found
    WHERE status = 'claimed' AND archived = 0

    UNION ALL

    SELECT 'other' AS type, COUNT(*) AS count
    FROM tbl_lost_found
    WHERE status != 'claimed' AND archived = 0;
    
-- SELECT type, COUNT(*) as count
    -- FROM tbl_lost_found
    -- WHERE archived = 0
    -- GROUP BY type
    `;

    db.query(summaryQuery, (err, summaryRows) => {
        if (err) {
            console.error("Error fetching summary:", err);
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        const claimedQuery = `
            SELECT 
                lf.id AS item_id,
                lf.item_name,
                lf.type,
                lf.category,
                lf.description,
                lf.location,
                lf.status AS item_status,
                lf.date_reported,
                r.created_at,
                CASE 
                    WHEN lf.is_anonymous = 1 THEN 'Anonymous'
                    ELSE reporter.name
                END AS user_name,
                c.id AS claim_id,
                c.created_at AS claim_date,
                claimer.name AS claimer_name,
                holder.name AS holder_name
            FROM tbl_claims c
            LEFT JOIN tbl_lost_found lf ON c.item_id = lf.id
            LEFT JOIN tbl_reports r ON lf.report_id = r.id
            LEFT JOIN tbl_users reporter ON lf.user_id = reporter.id
            LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
            LEFT JOIN tbl_users holder ON c.holder_id = holder.id
            WHERE c.status = 'accepted' AND lf.archived = 0 
            ORDER BY c.created_at DESC
        `;

        db.query(claimedQuery, (err, claimedRows) => {
            if (err) {
                console.error("Error fetching claimed items:", err);
                return res.status(500).json({ success: false, message: "Server Error" });
            }

            res.json({
                success: true,
                chart: summaryRows,
                claimed: claimedRows,
            });
        });
    });
});

module.exports = router;