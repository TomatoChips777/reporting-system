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


// router.post('/send-message', upload.single("image"), (req, res) => {
//     const { sender_id, receiver_id, message } = req.body;
//     const image_path = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!sender_id || !receiver_id || !message.trim()) {
//         return res.status(400).json({ success: false, message: 'Invalid request' });
//     }

//     const query = `
//                 INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path) VALUES (?, ?, ?, ?)
//     `;

//     db.query(query, [sender_id, receiver_id, message, image_path], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }
//         const newMessage = {
//             id: result.insertId,
//             senderId: sender_id,
//             text: message,
//             created_at: new Date().toISOString(),
//             conversationId: receiver_id
//         }
//         req.io.emit('updateMessage', {senderId: sender_id, receiverId: receiver_id, newMsg: newMessage});

//         res.json({
//             success: true,
//             message: newMessage
//         });
//     });
// });


router.post('/send-message', upload.single("image"), (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    const image = req.file ? req.file.filename : null;

    // Ensure either message or image exists
    if (!sender_id || !receiver_id || (!message.trim() && !image)) {
        return res.status(400).json({ success: false, message: 'Message or image is required' });
    }

    const textMessage = message.trim() ? message : 'sent a photo';
    const query = `
        INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path) VALUES (?, ?, ?, ?)
    `;

    db.query(query, [sender_id, receiver_id, message || '', image], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Fetch sender & receiver details
        const fetchUserQuery = `
            SELECT 
                u1.id AS sender_id, u1.name AS sender_name, u1.image_url AS sender_avatar,
                u2.id AS receiver_id, u2.name AS receiver_name, u2.image_url AS receiver_avatar
            FROM tbl_users u1
            JOIN tbl_users u2 ON u2.id = ?
            WHERE u1.id = ?
        `;

        db.query(fetchUserQuery, [receiver_id, sender_id], (err, users) => {
            if (err || users.length === 0) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ success: false, message: 'User lookup failed' });
            }

            const sender = users[0];
            const newMessage = {
                id: result.insertId,
                image_path: image,
                senderId: sender.sender_id,
                text: textMessage,
                created_at: new Date().toISOString(),
                user: {
                    id: sender.receiver_id,
                    name: sender.receiver_name,
                    avatar: sender.receiver_avatar
                }
            };

            // Emit message via socket
            req.io.emit('updateMessage', { senderId: sender.sender_id, receiverId: sender.receiver_id, newMsg: newMessage });

            res.json({
                success: true,
                message: newMessage
            });
        });
    });
});

// router.post('/send-message', upload.single("image"), (req, res) => {
//     const { sender_id, receiver_id, message } = req.body;
//     // const image_path = req.file ? `/uploads/${req.file.filename}` : null;
//     const image = req.file ? req.file.filename : null;


//     if (!sender_id || !receiver_id || !message.trim()) {
//         return res.status(400).json({ success: false, message: 'Invalid request' });
//     }

//     const query = `
//         INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path) VALUES (?, ?, ?, ?)
//     `;

//     db.query(query, [sender_id, receiver_id, message, image], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         // Fetch sender & receiver details to match `get-messages` structure
//         const fetchUserQuery = `
//             SELECT 
//                 u1.id AS sender_id, u1.name AS sender_name, u1.image_url AS sender_avatar,
//                 u2.id AS receiver_id, u2.name AS receiver_name, u2.image_url AS receiver_avatar
//             FROM tbl_users u1
//             JOIN tbl_users u2 ON u2.id = ?
//             WHERE u1.id = ?
//         `;

//         db.query(fetchUserQuery, [receiver_id, sender_id], (err, users) => {
//             if (err || users.length === 0) {
//                 console.error('Error fetching users:', err);
//                 return res.status(500).json({ success: false, message: 'User lookup failed' });
//             }

//             const sender = users[0];
//             const newMessage = {
//                 id: result.insertId,
//                 image_path: image,
//                 senderId: sender.sender_id,
//                 text: message,
//                 created_at: new Date().toISOString(),
//                 user: {
//                     id: sender.receiver_id,
//                     name: sender.receiver_name,
//                     avatar: sender.receiver_avatar
//                 }
//             };

//             // Emit message via socket
//             req.io.emit('updateMessage', { senderId: sender.sender_id, receiverId: sender.receiver_id, newMsg: newMessage });

//             res.json({
//                 success: true,
//                 message: newMessage
//             });
//         });
//     });
// });

// router.get('/get-messages/:userId', (req, res) => {
//     const {userId} = req.params;

//     if (!userId) {
//         return res.status(400).json({
//             success: false,
//             message: 'User ID is required'
//         });
//     }

//     const query = `
//        SELECT 
//     m.id AS message_id,
//     m.sender_id,
//     m.receiver_id,
//     m.message AS text,
//     m.image_path,
//     m.created_at,
//     u1.id AS sender_id,
//     u1.name AS sender_name,
//     u1.image_url AS sender_avatar,
//     u2.id AS receiver_id,
//     u2.name AS receiver_name,
//     u2.image_url AS receiver_avatar
// FROM tbl_messages m
// LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
// LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
// WHERE m.sender_id = ? OR m.receiver_id = ?
// ORDER BY m.created_at DESC

//     `;

//     db.query(query, [userId, userId], (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database error'
//             });
//         }
    
//         const conversations = {};
    
//         results.forEach(msg => {
//             const conversationPartner = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
//             const conversationKey = `${userId}-${conversationPartner}`;
    
//             if (!conversations[conversationKey]) {
//                 conversations[conversationKey] = {
//                     id: conversationPartner,
//                     user: {
//                         id: conversationPartner,
//                         name: msg.sender_id == userId ? msg.receiver_name : msg.sender_name,
//                         avatar: msg.sender_id == userId ? msg.receiver_avatar : msg.sender_avatar
//                     },
//                     lastMessage: msg.text, 
//                     created_at: msg.created_at,
//                     unread: 0,
//                     messages: []
//                 };
//             }
    
//             conversations[conversationKey].messages.unshift({ 
//                 id: msg.message_id,
//                 senderId: msg.sender_id,
//                 image_path: msg.image_path,
//                 text: msg.text,
//                 created_at: msg.created_at
//             });
//         });
    
//         res.json({
//             success: true,
//             messages: Object.values(conversations)
//         });
//     });
// });


// module.exports = router;

router.get('/get-messages/:userId', (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    const query = `
        SELECT 
            m.id AS message_id,
            m.sender_id,
            m.receiver_id,
            m.message AS text,
            m.image_path,
            m.created_at,
            u1.id AS sender_id,
            u1.name AS sender_name,
            u1.image_url AS sender_avatar,
            u2.id AS receiver_id,
            u2.name AS receiver_name,
            u2.image_url AS receiver_avatar
        FROM tbl_messages m
        LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
        LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.created_at DESC
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        const conversations = {};

        results.forEach(msg => {
            const conversationPartner = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
            const conversationKey = `${userId}-${conversationPartner}`;

            if (!conversations[conversationKey]) {
                conversations[conversationKey] = {
                    id: conversationPartner,
                    user: {
                        id: conversationPartner,
                        name: msg.sender_id == userId ? msg.receiver_name : msg.sender_name,
                        avatar: msg.sender_id == userId ? msg.receiver_avatar : msg.sender_avatar
                    },
                    lastMessage: msg.text, 
                    created_at: msg.created_at,
                    unread: 0,
                    messages: []
                };
            }

            // Check if the message only contains an image and no text
            if (msg.image_path && (!msg.text || msg.text.trim() === '')) {
                msg.text = 'Photo attached'; // You can change this message to something else if you prefer
            }

            // Assign the message to the conversation
            conversations[conversationKey].messages.unshift({
                id: msg.message_id,
                senderId: msg.sender_id,
                image_path: msg.image_path,
                text: msg.text,
                created_at: msg.created_at
            });

            // Set lastMessage to the most recent image or text
            if (msg.image_path && (!conversations[conversationKey].lastMessage || conversations[conversationKey].lastMessage === msg.text)) {
                conversations[conversationKey].lastMessage = 'Photo attached'; // Or use `msg.image_path` if you want the URL instead
            } else if (msg.text && !msg.image_path) {
                conversations[conversationKey].lastMessage = msg.text;
            }
        });

        res.json({
            success: true,
            messages: Object.values(conversations)
        });
    });
});

module.exports = router;
