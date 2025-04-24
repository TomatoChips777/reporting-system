const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {fetchData} = require('../config/dbUtils');
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

router.get('/items', (req, res) => {
    const query = `
        SELECT 
    lf.*,
    r.created_at,
    CASE 
        WHEN lf.is_anonymous = 1 THEN 'Anonymous'
        ELSE u.name 
    END AS reporter_name,
    COUNT(c.id) AS claim_count,
    GROUP_CONCAT(c.status) AS claim_statuses
FROM tbl_lost_found lf
LEFT JOIN tbl_users u ON lf.user_id = u.id 
LEFT JOIN tbl_reports r ON lf.report_id = r.id
LEFT JOIN (
    SELECT * FROM tbl_claims WHERE status != 'rejected'
) c ON c.item_id = lf.id
WHERE lf.archived = 0
    AND COALESCE(r.report_type, '') != '' 
    AND lf.status = 'open' 
    AND r.archived = 0
GROUP BY lf.id, u.name, r.created_at
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

            const title = `${report_type}`;
            // const message = `New report about ${type} ${item_name} at ${location}.`;
            const message = `New ${type.toLowerCase()} item reported: "${item_name}" at ${location}.`;

            const notificationQuery = `
                INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
                VALUES (?, ?, ?, ?)`;

            db.query(notificationQuery, [report_id, user_id, message, title], (err) => {
                if (err) {
                    console.error("Error inserting notification:", err);
                }
            });

            req.io.emit('update');
            res.json({ success: true, message: 'Lost & Found item submitted successfully', reportId: report_id });
        });
    });
});


router.put('/update-items/:id', upload.single('image_path'), (req, res) => {
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
        WHERE c.item_id = ? and c.status != 'rejected'
    `;
    db.query(query, [itemId], (err, results) => {
        if (err) {
            console.error('Error fetching claims:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        req.io.emit('update');
        res.json({ success: true, claims: results });
    });
});


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
                lf.report_id,
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
                holder.name AS holder_name,
                c.remarks   
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
        req.io.emit('update');
        res.json({ success: true, claims: results });
    });
});

router.put('/item/reject-claimed', (req, res) => {
    const { item_id, holder_id, claimer_id, report_id, type, item_name, location } = req.body;

    if (!item_id || !holder_id || !claimer_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing item_id, holder_id, or claimer_id'
        });
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({
                success: false,
                message: 'Error starting transaction'
            });
        }

        const updateClaimQuery = `
            UPDATE tbl_claims 
            SET status = 'under_review', remarks = 'unclaimed'
            WHERE item_id = ? AND holder_id = ? AND claimer_id = ?
        `;

        db.query(updateClaimQuery, [item_id, holder_id, claimer_id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error updating claim:', err);
                    return res.status(500).json({ success: false, message: 'Error updating claim' });
                });
            }

            if (result.affectedRows === 0) {
                return db.rollback(() => {
                    return res.status(404).json({ success: false, message: 'No matching claim found to update' });
                });
            }

            const updateLostFoundQuery = `
                UPDATE tbl_lost_found
                SET status = 'open'
                WHERE id = ?
            `;

            db.query(updateLostFoundQuery, [item_id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error updating tbl_lost_found status:', err);
                        return res.status(500).json({ success: false, message: 'Error updating tbl_lost_found status' });
                    });
                }

                const updateReportsQuery = `
                    UPDATE tbl_reports
                    SET status = 'in_progress'
                    WHERE id = ?
                `;

                db.query(updateReportsQuery, [report_id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error updating tbl_reports status:', err);
                            return res.status(500).json({ success: false, message: 'Error updating tbl_reports status' });
                        });
                    }

                    const title = "Lost and Found";
                    const notifMessage = `Your ${type === 'lost' ? 'return' : 'claim'} request for the ${type} item "${item_name}" at ${location} was previously accepted in error. It has now been reverted and the item is available again for claiming. We apologize for the inconvenience.`;

                    const notificationQuery = `
                        INSERT INTO tbl_user_notifications (report_id, user_id, message, title)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(notificationQuery, [item_id, claimer_id, notifMessage, title], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Error notifying claimer:", err);
                                return res.status(500).json({ success: false, message: 'Failed to notify claimer' });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({ success: false, message: 'Error committing transaction' });
                                });
                            }

                            req.io.emit('update');
                            return res.json({
                                success: true,
                                message: 'Claim request rejected, statuses updated, and claimer notified'
                            });
                        });
                    });
                });
            });
        });
    });
});


router.put('/add-remarks', (req, res) => {
    const { claim_id, remarks, report_id } = req.body;

    const addRemarksQuery = 'UPDATE tbl_claims SET remarks = ? WHERE id = ?';

    db.query(addRemarksQuery, [remarks, claim_id], (err, result) => {
        if (err) {
            console.error('Error updating remarks:', err);
            return res.status(500).json({ success: false, message: 'Failed to update remarks' });
        }

        if (result.affectedRows > 0) {
            const newReportStatus = remarks === 'claimed' ? 'resolved' : 'in_progress';
            const updateReportStatus = 'UPDATE tbl_reports SET status=? WHERE id = ? ';

            db.query(updateReportStatus, [newReportStatus, report_id], (err) => {
                if (err) {
                    console.error('Error updating report status:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update report status' });
                }

                return res.status(200).json({ success: true, message: 'Remarks and report status updated successfully' });
            });
        } else {
            return res.status(404).json({ success: false, message: 'Claim not found or no changes made' });
        }
    });
});

router.put('/item/accept-claim', (req, res) => {
    const { item_id, holder_id, claimer_id, type, location, item_name } = req.body;

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
                    const title = "Lost and Found";

                    // Message for the claimer
                    const claimerMessage = `Your request to ${type === 'lost' ? 'return' : 'claim'} the ${type === 'lost' ? 'lost' : 'found'} ${item_name} at ${location} has been accepted. Please coordinate with the ${type === 'lost' ? 'holder' : 'reporter'} for retrieval.`;

                    // Message for the holder
                    const holderMessage = `The ${item_name} you reported as ${type} at ${location} has been marked as claimed. Please coordinate with the ${type === 'lost' ? 'owner' : 'claimer'} to complete the return.`;

                    const notificationQuery = `
                        INSERT INTO tbl_user_notifications (report_id, user_id, message, title)
                        VALUES (?, ?, ?, ?)
                    `;

                    // Send notification to claimer
                    db.query(notificationQuery, [item_id, claimer_id, claimerMessage, title], (err) => {
                        if (err) {
                            console.error("Error notifying claimer:", err);
                            return res.status(500).json({ success: false, message: 'Failed to notify claimer' });
                        }

                        // Send notification to holder
                        db.query(notificationQuery, [item_id, holder_id, holderMessage, title], (err) => {
                            if (err) {
                                console.error("Error notifying holder:", err);
                                return res.status(500).json({ success: false, message: 'Failed to notify holder' });
                            }

                            req.io.emit('update');
                            return res.json({
                                success: true,
                                message: 'Claim accepted, item marked as claimed, and notifications sent to both parties'
                            });
                        });
                    });
                });
            });
        });
    });
});



router.put('/item/reject-claim-request', (req, res) => {
    const { item_id, holder_id, claimer_id, item_name, location, type } = req.body;

    if (!item_id || !holder_id || !claimer_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing item_id, holder_id, or claimer_id'
        });
    }

    const updateQuery = `
        UPDATE tbl_claims 
        SET status = 'rejected'
        WHERE item_id = ? AND holder_id = ? AND claimer_id = ?
    `;

    db.query(updateQuery, [item_id, holder_id, claimer_id], (err, result) => {
        if (err) {
            console.error('Error rejecting claim request:', err);
            return res.status(500).json({
                success: false,
                message: 'Error rejecting claim request'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching claim found to reject'
            });
        }

        const title = "Lost and Found";
        const message = `Your ${type === 'lost' ? 'return' : 'claim'} request for the ${type} "${item_name}" at ${location} has been rejected.`;

        const notificationQuery = `
            INSERT INTO tbl_user_notifications (report_id, user_id, message, title)
            VALUES (?, ?, ?, ?)
        `;

        db.query(notificationQuery, [item_id, claimer_id, message, title], (err) => {
            if (err) {
                console.error("Error notifying claimer:", err);
                return res.status(500).json({ success: false, message: 'Failed to notify claimer' });
            }

            req.io.emit('update');
            res.json({
                success: true,
                message: 'Claim request rejected and claimer notified'
            });
        });
    });
});

router.post('/item/claim-return-request', (req, res) => {
    const { itemId, claimerId, holderId, description, claimerName, type, item_name, location } = req.body;

    const checkQuery = `
        SELECT * FROM tbl_claims 
        WHERE item_id = ? AND claimer_id = ? AND status != 'rejected'
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
            console.log('User already sent a claim request for this item');
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
            const title = "Lost and Found";
            const capitalizeFirstLetter = (str) => {
                if (!str) return '';
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            
            const capitalizedClaimerName = capitalizeFirstLetter(claimerName);
            const message = `${capitalizedClaimerName} has sent a ${type === 'lost' ? 'return' : 'claim'} request for "${type} ${item_name} at ${location}" (Ref.ID ${itemId}).`;

            const notificationQuery = `
                INSERT INTO tbl_admin_notifications (report_id, user_id, message, title)
                VALUES (?, ?, ?, ?)
            `;

            // Send notification to claimer
            db.query(notificationQuery, [itemId, claimerId, message, title], (err) => {
                if (err) {
                    console.error("Error notifying claimer:", err);
                    return res.status(500).json({ success: false, message: 'Failed to notify claimer' });
                }
                req.io.emit('update');
                return res.json({
                    success: true,
                    message: 'Claim request sent successfully'
                });
            });
        });
    });
});


// GET /all-data
router.get('/all-data', async (req, res) => {
    const itemsQuery = `
        SELECT 
            lf.*,
            r.created_at,
            CASE WHEN lf.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END AS user_name,
            COUNT(c.id) AS claim_count,
            GROUP_CONCAT(c.status) AS claim_statuses
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id 
        LEFT JOIN tbl_reports r ON lf.report_id = r.id
        LEFT JOIN (SELECT * FROM tbl_claims WHERE status != 'rejected') c ON c.item_id = lf.id
        WHERE lf.archived = 0
            AND COALESCE(r.report_type, '') != '' 
            AND lf.status = 'open' 
            AND r.archived = 0
        GROUP BY lf.id, u.name, r.created_at
        ORDER BY lf.date_reported DESC
    `;

    const analyticsQuery = `
        SELECT 'lost' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE type = 'lost' AND archived = 0
        UNION ALL
        SELECT 'found' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE type = 'found' AND archived = 0
        UNION ALL
        SELECT 'claimed' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE status = 'claimed' AND archived = 0
        UNION ALL
        SELECT 'other' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE status != 'claimed' AND archived = 0
    `;

    const claimedItemsQuery = `
        SELECT 
            lf.id AS item_id,
            lf.item_name,
            lf.type,
            lf.category,
            lf.description,
            lf.report_id,
            lf.location,
            lf.status AS item_status,
            lf.date_reported,
            r.created_at,
            CASE WHEN lf.is_anonymous = 1 THEN 'Anonymous' ELSE reporter.name END AS user_name,
            c.id AS claim_id,
            c.created_at AS claim_date,
            claimer.name AS claimer_name,
            holder.name AS holder_name,
            c.remarks   
        FROM tbl_claims c
        LEFT JOIN tbl_lost_found lf ON c.item_id = lf.id
        LEFT JOIN tbl_reports r ON lf.report_id = r.id
        LEFT JOIN tbl_users reporter ON lf.user_id = reporter.id
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.status = 'accepted' AND lf.archived = 0 
        ORDER BY c.created_at DESC
    `;

    const claimsPerItemQuery = `
        SELECT 
            c.*, 
            c.item_id,
            claimer.name AS claimer_name,
            holder.name AS holder_name
        FROM tbl_claims c
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.status != 'rejected'
    `;

    try {
        const [items, analytics, claimedItems, allClaims] = await Promise.all([
            fetchData(itemsQuery),
            fetchData(analyticsQuery),
            fetchData(claimedItemsQuery),
            fetchData(claimsPerItemQuery)
        ]);

        // Organize claims by itemId
        const claimsMap = {};
        allClaims.forEach(claim => {
            if (!claimsMap[claim.item_id]) {
                claimsMap[claim.item_id] = [];
            }
            claimsMap[claim.item_id].push(claim);
        });

        res.json({
            success: true,
            data: {
                items,
                claims_by_item: claimsMap,
                analytics_chart: analytics,
                claimed_items: claimedItems
            }
        });
    } catch (err) {
        console.error('Error fetching all data:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
});

module.exports = router;