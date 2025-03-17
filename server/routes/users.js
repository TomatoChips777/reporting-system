const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', (req, res) => {
    const { email, name, picture, token } = req.body;

    if (!email || !name || !picture || !token) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    db.query('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        let user;
        if (rows.length === 0) {
            // Insert new user
            db.query(
                'INSERT INTO tbl_users (name, email, role, image_url, token) VALUES (?, ?, ?, ?, ?)',
                [name, email, 'student', picture, token],
                (insertErr) => {
                    if (insertErr) {
                        console.error('Database insert error:', insertErr);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    // Fetch the newly inserted user
                    db.query('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email], (fetchErr, newUser) => {
                        if (fetchErr) {
                            console.error('Database fetch error:', fetchErr);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        user = newUser[0];
                        return res.json(user);
                    });
                }
            );
        } else {
            user = rows[0];
            return res.json(user);
        }
    });
});

router.post('/get-current-user', (req, res) => {
    const { id, email } = req.body;

    if (!id && !email) {
        return res.status(400).json({ error: 'ID or email is required' });
    }

    const query = id ? 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE id = ?' : 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?';
    const param = id ? id : email;

    db.query(query, [param], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(rows[0]);
    });
});

module.exports = router;