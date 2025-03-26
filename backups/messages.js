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
//     const { sender_id, receiver_id, message, report_id } = req.body; // Expecting report_id in the body
//     const image = req.file ? req.file.filename : null;

//     // Ensure either message or image exists, and report_id is provided
//     if (!sender_id || !receiver_id || (!message.trim() && !image) || !report_id) {
//         return res.status(400).json({ success: false, message: 'Message or image is required, and report_id is mandatory' });
//     }

//     const textMessage = message.trim() ? message : 'sent a photo';

//     const claimQuery = ` 
//     INSET INTO tbl_claim_items (item_id, claimer_id, holder_id) 
//     VALUES (?, ?, ?)
//     `;

//     const query = `
//         INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path, report_id) 
//         VALUES (?, ?, ?, ?, ?)
//     `;

//     db.query(query, [sender_id, receiver_id, message || '', image, report_id], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         // Fetch sender & receiver details
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
//                 text: textMessage,
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


// router.post('/send-message', upload.single("image"), (req, res) => {
//     const { sender_id, receiver_id, message, report_id } = req.body; // Expecting report_id in the body
//     const image = req.file ? req.file.filename : null;

//     // Ensure either message or image exists, and report_id is provided
//     if (!sender_id || !receiver_id || (!message.trim() && !image) || !report_id) {
//         return res.status(400).json({ success: false, message: 'Message or image is required, and report_id is mandatory' });
//     }

//     const textMessage = message.trim() ? message : 'sent a photo';

//     // Insert message into tbl_messages
//     const messageQuery = `
//         INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path, report_id) 
//         VALUES (?, ?, ?, ?, ?)
//     `;

//     db.query(messageQuery, [sender_id, receiver_id, textMessage, image, report_id], (err, result) => {
//         if (err) {
//             console.error('Database error during message insert:', err);
//             return res.status(500).json({ success: false, message: 'Database error during message insert' });
//         }

//         // Check if claim already exists before inserting into tbl_claim_items
//         const checkClaimQuery = `
//             SELECT * FROM tbl_claim_items WHERE item_id = ? AND claimer_id = ? AND holder_id = ?
//         `;

//         db.query(checkClaimQuery, [report_id, sender_id, receiver_id], (err, claimResult) => {
//             if (err) {
//                 console.error('Database error during claim check:', err);
//                 return res.status(500).json({ success: false, message: 'Database error during claim check' });
//             }

//             // Only insert the claim if it doesn't exist
//             if (claimResult.length === 0) {
//                 const claimQuery = `
//                     INSERT INTO tbl_claim_items (item_id, claimer_id, holder_id) 
//                     VALUES (?, ?, ?)
//                 `;

//                 db.query(claimQuery, [report_id, sender_id, receiver_id], (err, claimInsertResult) => {
//                     if (err) {
//                         console.error('Database error during claim insert:', err);
//                         return res.status(500).json({ success: false, message: 'Database error during claim insert' });
//                     }
//                 });
//             }

//             // Fetch sender & receiver details after inserting message
//             const fetchUserQuery = `
//                 SELECT 
//                     u1.id AS sender_id, u1.name AS sender_name, u1.image_url AS sender_avatar,
//                     u2.id AS receiver_id, u2.name AS receiver_name, u2.image_url AS receiver_avatar
//                 FROM tbl_users u1
//                 JOIN tbl_users u2 ON u2.id = ?
//                 WHERE u1.id = ?
//             `;

//             db.query(fetchUserQuery, [receiver_id, sender_id], (err, users) => {
//                 if (err || users.length === 0) {
//                     console.error('Error fetching users:', err);
//                     return res.status(500).json({ success: false, message: 'User lookup failed' });
//                 }

//                 const sender = users[0];
//                 const newMessage = {
//                     id: result.insertId,
//                     image_path: image,
//                     senderId: sender.sender_id,
//                     text: textMessage,
//                     created_at: new Date().toISOString(),
//                     user: {
//                         id: sender.receiver_id,
//                         name: sender.receiver_name,
//                         avatar: sender.receiver_avatar
//                     }
//                 };

//                 // Emit message via socket
//                 req.io.emit('updateMessage', { senderId: sender.sender_id, receiverId: sender.receiver_id, newMsg: newMessage, report_id: report_id });

//                 // Return the response with the new message
//                 res.json({
//                     success: true,
//                     message: newMessage
//                 });
//             });
//         });
//     });
// });

router.post('/send-message', upload.single("image"), (req, res) => {
    const { sender_id, receiver_id, message, report_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!sender_id || !receiver_id || (!message.trim() && !image) || !report_id) {
        return res.status(400).json({ success: false, message: 'Message or image is required, and report_id is mandatory' });
    }

    const textMessage = message.trim() ? message : '';

    // Step 1: Check if a chat session exists
    const checkChatSessionQuery = `
        SELECT id FROM tbl_message_sessions 
        WHERE (user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?) 
        AND report_id = ?
    `;

    db.query(checkChatSessionQuery, [sender_id, receiver_id, receiver_id, sender_id, report_id], (err, chatResult) => {
        if (err) {
            console.error('Database error checking chat session:', err);
            return res.status(500).json({ success: false, message: 'Database error checking chat session' });
        }

        let chatSessionId;

        if (chatResult.length === 0) {
            // Step 2: Create new chat session if not exists
            const createChatSessionQuery = `
                INSERT INTO tbl_message_sessions (user1_id, user2_id, report_id) 
                VALUES (?, ?, ?)
            `;

            db.query(createChatSessionQuery, [sender_id, receiver_id, report_id], (err, insertResult) => {
                if (err) {
                    console.error('Database error creating chat session:', err);
                    return res.status(500).json({ success: false, message: 'Database error creating chat session' });
                }
                chatSessionId = insertResult.insertId;
                insertMessage(chatSessionId);
            });
        } else {
            chatSessionId = chatResult[0].id;
            insertMessage(chatSessionId);
        }
    });

    // Step 3: Insert message into tbl_messages
    function insertMessage(chatSessionId) {
        const messageQuery = `
            INSERT INTO tbl_messages (message_session_id, sender_id, receiver_id, report_id, message, image_path) 
            VALUES (?, ?, ?, ? ,?, ?)
        `;

        db.query(messageQuery, [chatSessionId, sender_id, receiver_id, report_id, textMessage, image], (err, result) => {
            if (err) {
                console.error('Database error during message insert:', err);
                return res.status(500).json({ success: false, message: 'Database error during message insert' });
            }

            // Step 4: Check if claim exists
            const checkClaimQuery = `
                SELECT * FROM tbl_claim_items WHERE item_id = ? AND claimer_id = ? AND holder_id = ?
            `;

            db.query(checkClaimQuery, [report_id, sender_id, receiver_id], (err, claimResult) => {
                if (err) {
                    console.error('Database error during claim check:', err);
                    return res.status(500).json({ success: false, message: 'Database error during claim check' });
                }

                if (claimResult.length === 0) {
                    const claimQuery = `
                        INSERT INTO tbl_claim_items (item_id, claimer_id, holder_id) 
                        VALUES (?, ?, ?)
                    `;

                    db.query(claimQuery, [report_id, sender_id, receiver_id], (err) => {
                        if (err) {
                            console.error('Database error during claim insert:', err);
                            return res.status(500).json({ success: false, message: 'Database error during claim insert' });
                        }
                    });
                }

                // Step 5: Fetch sender & receiver details
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
                    req.io.emit('updateMessage', { senderId: sender.sender_id, receiverId: sender.receiver_id, newMsg: newMessage, report_id: report_id, message_session_id: chatSessionId });

                    res.json({ success: true, message: newMessage });
                });
            });
        });
    }
});



// router.post('/send-message', upload.single("image"), (req, res) => {
//     const { sender_id, receiver_id, message } = req.body;
//     const image = req.file ? req.file.filename : null;

//     // Ensure either message or image exists
//     if (!sender_id || !receiver_id || (!message.trim() && !image)) {
//         return res.status(400).json({ success: false, message: 'Message or image is required' });
//     }

//     const textMessage = message.trim() ? message : 'sent a photo';
//     const query = `
//         INSERT INTO tbl_messages (sender_id, receiver_id, message, image_path) VALUES (?, ?, ?, ?)
//     `;

//     db.query(query, [sender_id, receiver_id, message || '', image], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         // Fetch sender & receiver details
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
//                 text: textMessage,
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
//     const { userId } = req.params;

//     if (!userId) {
//         return res.status(400).json({
//             success: false,
//             message: 'User ID is required'
//         });
//     }

//     const query = `
//         SELECT 
//     m.id AS message_id,
//     m.sender_id,
//     m.receiver_id,
//     m.message AS text,
//     m.image_path,
//     m.created_at,
//     lf.id as report_id,
//     u1.id AS sender_id,
//     u1.name AS sender_name,
//     u1.image_url AS sender_avatar,
//     u2.id AS receiver_id,
//     u2.name AS receiver_name,
//     u2.image_url AS receiver_avatar
//     FROM tbl_messages m
//     LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
//     LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
//     LEFT JOIN tbl_lost_found lf ON m.report_id = lf.id
//     WHERE m.sender_id = ? OR m.receiver_id = ? GROUP BY m.report_id
//     ORDER BY m.created_at DESC;
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
//                     report_id: msg.report_id,
//                     lastMessage: msg.text, 

//                     created_at: msg.created_at,
//                     unread: 0,
//                     messages: []
//                 };
//             }

//             if (msg.image_path && (!msg.text || msg.text.trim() === '')) {
//                 msg.text = 'Photo attached';
//             }

//             // Assign the message to the conversation
//             conversations[conversationKey].messages.unshift({
//                 id: msg.message_id,
//                 senderId: msg.sender_id,
//                 image_path: msg.image_path,
//                 text: msg.text,
//                 created_at: msg.created_at,
//                 report_id: msg.report_id
//             });

//             // Set lastMessage to the most recent image or text
//             if (msg.image_path && (!conversations[conversationKey].lastMessage || conversations[conversationKey].lastMessage === msg.text)) {
//                 conversations[conversationKey].lastMessage = 'Photo attached';  
//             } else if (msg.text && !msg.image_path) {
//                 conversations[conversationKey].lastMessage = msg.text;
//             }
//         });

//         res.json({
//             success: true,
//             messages: Object.values(conversations)
//         });
//     });
// });

// module.exports = router;


// router.get('/get-messages/:userId', (req, res) => {
//     const { userId } = req.params;

//     if (!userId) {
//         return res.status(400).json({ success: false, message: 'User ID is required' });
//     }

//     const query = `
//         SELECT 
//             ms.id AS message_session_id,
//             m.id AS message_id,
//             m.sender_id,
//             m.receiver_id,
//             m.message AS text,
//             m.image_path,
//             m.created_at,
//             m.report_id,
//             u1.id AS sender_id,
//             u1.name AS sender_name,
//             u1.image_url AS sender_avatar,
//             u2.id AS receiver_id,
//             u2.name AS receiver_name,
//             u2.image_url AS receiver_avatar
//         FROM tbl_messages m
//         JOIN tbl_message_sessions ms ON ms.id = m.message_session_id
//         LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
//         LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
//         WHERE ms.user1_id = ? OR ms.user2_id = ?
//         ORDER BY m.created_at ASC
//     `;

//     db.query(query, [userId, userId], (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         const groupedMessages = {};

//         results.forEach(msg => {
//             const sessionId = msg.message_session_id;

//             if (!groupedMessages[sessionId]) {
//                 groupedMessages[sessionId] = {
//                     message_session_id: sessionId,
//                     report_id: msg.report_id,
//                     user: {
//                         id: msg.sender_id == userId ? msg.receiver_id : msg.sender_id,
//                         name: msg.sender_id == userId ? msg.receiver_name : msg.sender_name,
//                         avatar: msg.sender_id == userId ? msg.receiver_avatar : msg.sender_avatar
//                     },
//                     messages: []
//                 };
//             }

//             groupedMessages[sessionId].messages.push({
//                 id: msg.message_id,
//                 senderId: msg.sender_id,
//                 receiverId: msg.receiver_id,
//                 text: msg.text || (msg.image_path ? 'Photo attached' : ''),
//                 image_path: msg.image_path,
//                 created_at: msg.created_at
//             });
//         });

//         res.json({ success: true, 
//             messages: Object.values(groupedMessages) });
//     });
// });


// router.get('/get-messages/:userId', (req, res) => {
//     const { userId } = req.params;

//     if (!userId) {
//         return res.status(400).json({ success: false, message: 'User ID is required' });
//     }

//     const query = `
//         SELECT 
//             ms.id AS message_session_id,
//             m.id AS message_id,
//             m.sender_id,
//             m.receiver_id,
//             m.message AS text,
//             m.image_path,
//             m.created_at,
//             m.report_id,
//             u1.id AS sender_id,
//             u1.name AS sender_name,
//             u1.image_url AS sender_avatar,
//             u2.id AS receiver_id,
//             u2.name AS receiver_name,
//             u2.image_url AS receiver_avatar
//         FROM tbl_messages m
//         JOIN tbl_message_sessions ms ON ms.id = m.message_session_id
//         LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
//         LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
//         WHERE ms.user1_id = ? OR ms.user2_id = ?
//         ORDER BY m.created_at DESC
//     `;

//     db.query(query, [userId, userId], (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         const conversations = {};

//         results.forEach(msg => {
//             const conversationKey = `${msg.message_session_id}`; // Unique key for session

//             if (!conversations[conversationKey]) {
//                 conversations[conversationKey] = {
//                     message_session_id: msg.message_session_id,
//                     user: {
//                         id: msg.sender_id == userId ? msg.receiver_id : msg.sender_id,
//                         name: msg.sender_id == userId ? msg.receiver_name : msg.sender_name,
//                         avatar: msg.sender_id == userId ? msg.receiver_avatar : msg.sender_avatar
//                     },
//                     report_id: msg.report_id,
//                     lastMessage: msg.text, 
//                     created_at: msg.created_at,
//                     unread: 0,
//                     messages: []
//                 };
//             }

//             if (msg.image_path && (!msg.text || msg.text.trim() === '')) {
//                 msg.text = 'Photo attached';
//             }

//             conversations[conversationKey].messages.unshift({
//                 id: msg.message_id,
//                 senderId: msg.sender_id,
//                 receiverId: msg.receiver_id,
//                 report_id: msg.report_id,
//                 image_path: msg.image_path,
//                 text: msg.text,
//                 created_at: msg.created_at
//             });

//             if (!conversations[conversationKey].lastMessage || conversations[conversationKey].lastMessage === msg.text) {
//                 conversations[conversationKey].lastMessage = msg.image_path ? 'Photo attached' : msg.text;
//             }
//         });

//         res.json({ success: true, messages: Object.values(conversations) });
//     });
// });


router.get('/get-messages/:userId', (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    const query = `SELECT 
        ms.id AS message_session_id,
        m.id AS message_id,
        m.sender_id,
        m.message AS text,
        m.image_path,
        m.created_at,
        m.report_id,
        u1.id AS sender_id,
        u1.name AS sender_name,
        u1.image_url AS sender_avatar,
        u2.id AS receiver_id,
        u2.name AS receiver_name,
        u2.image_url AS receiver_avatar,
        r.item_name,
        r.type,
        r.is_anonymous,
        r.user_id AS report_owner_id
    FROM tbl_messages m
    JOIN tbl_message_sessions ms ON ms.id = m.message_session_id
    LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
    LEFT JOIN tbl_users u2 ON (ms.user1_id = u2.id OR ms.user2_id = u2.id) AND u2.id != m.sender_id
    LEFT JOIN tbl_lost_found r ON m.report_id = r.id
    WHERE ms.user1_id = ? OR ms.user2_id = ?
    ORDER BY m.created_at DESC;`;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        const conversations = {};
        const anonymousAvatar = "server/uploads/1741225676129.png";

        results.forEach(msg => {
            const isAnonymous = msg.is_anonymous === 1 && msg.report_owner_id === msg.sender_id;
            const conversationPartner = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
            const conversationKey = `${msg.report_id}-${conversationPartner}`;

            if (!conversations[conversationKey]) {
                conversations[conversationKey] = {
                    id: conversationPartner,
                    senderId: msg.sender_id,
                    receiverId: msg.receiver_id,
                    user: {
                        id: conversationPartner,
                        name: msg.sender_id == userId 
                            ? msg.receiver_name // Show real receiver name
                            : (isAnonymous ? "Anonymous" : msg.sender_name), // Anonymize only if report owner
                        avatar: msg.sender_id == userId 
                            ? msg.receiver_avatar // Show real receiver avatar
                            : (isAnonymous ? anonymousAvatar : msg.sender_avatar) // Anonymize only if report owner
                    },
                    report_id: msg.report_id,
                    item_name: msg.item_name,
                    item_type: msg.type,
                    message_session_id: msg.message_session_id,
                    lastMessage: msg.text,
                    created_at: msg.created_at,
                    unread: 0,
                    messages: []
                };
            }

            if (msg.image_path && (!msg.text || msg.text.trim() === '')) {
                msg.text = 'Photo attached';
            }

            conversations[conversationKey].messages.unshift({
                id: msg.message_id,
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                report_id: msg.report_id,
                message_session_id: msg.message_session_id,
                image_path: isAnonymous ? null : msg.image_path, // Hide image only if anonymous
                text: msg.text,
                created_at: msg.created_at
            });

            if (msg.image_path && (!conversations[conversationKey].lastMessage || conversations[conversationKey].lastMessage === msg.text)) {
                conversations[conversationKey].lastMessage = 'Photo attached';
            } else if (msg.text && !msg.image_path) {
                conversations[conversationKey].lastMessage = msg.text;
            }
        });

        res.json({
            success: true,
            messages: Object.values(conversations)
        });
    });




    //     const query = `SELECT 
    //     ms.id AS message_session_id,
    //     m.id AS message_id,
    //     m.sender_id,
    //     m.message AS text,
    //     m.image_path,
    //     m.created_at,
    //     m.report_id,
    //     u1.id AS sender_id,
    //     u1.name AS sender_name,
    //     u1.image_url AS sender_avatar,
    //     u2.id AS receiver_id,
    //     u2.name AS receiver_name,
    //     u2.image_url AS receiver_avatar
    // FROM tbl_messages m
    // JOIN tbl_message_sessions ms ON ms.id = m.message_session_id
    // LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
    // LEFT JOIN tbl_users u2 ON (ms.user1_id = u2.id OR ms.user2_id = u2.id) AND u2.id != m.sender_id
    // WHERE ms.user1_id = ? OR ms.user2_id = ?
    // ORDER BY m.created_at DESC;
    // `;

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
    //             const conversationKey = `${msg.report_id}-${conversationPartner}`;

    //             if (!conversations[conversationKey]) {
    //                 conversations[conversationKey] = {
    //                     id: conversationPartner,
    //                     senderId: msg.sender_id,
    //                     receiverId: msg.receiver_id,
    //                     user: {
    //                         id: conversationPartner,
    //                         name: msg.sender_id == userId ? msg.receiver_name : msg.sender_name,
    //                         avatar: msg.sender_id == userId ? msg.receiver_avatar : msg.sender_avatar
    //                     },
    //                     report_id: msg.report_id,
    //                     message_session_id: msg.message_session_id,
    //                     lastMessage: msg.text,
    //                     created_at: msg.created_at,
    //                     unread: 0,
    //                     messages: []
    //                 };
    //             }

    //             if (msg.image_path && (!msg.text || msg.text.trim() === '')) {
    //                 msg.text = 'Photo attached';
    //             }

    //             conversations[conversationKey].messages.unshift({
    //                 id: msg.message_id,
    //                 senderId: msg.sender_id,
    //                 receiverId: msg.receiver_id,
    //                 report_id: msg.report_id,
    //                 message_session_id: msg.message_session_id,
    //                 image_path: msg.image_path,
    //                 text: msg.text,
    //                 created_at: msg.created_at,
    //                 report_id: msg.report_id
    //             });

    //             if (msg.image_path && (!conversations[conversationKey].lastMessage || conversations[conversationKey].lastMessage === msg.text)) {
    //                 conversations[conversationKey].lastMessage = 'Photo attached';
    //             } else if (msg.text && !msg.image_path) {
    //                 conversations[conversationKey].lastMessage = msg.text;
    //             }
    //         });

    //         res.json({
    //             success: true,
    //             messages: Object.values(conversations)
    //         });
    //     });
});

module.exports = router;

// SELECT
//             ms.id AS message_session_id,
//             m.id AS message_id,
//             m.sender_id,
//             m.receiver_id,
//             m.message AS text,
//             m.image_path,
//             m.message_session_id,
//             m.created_at,
//             m.report_id,
//             u1.id AS sender_id,
//             u1.name AS sender_name,
//             u1.image_url AS sender_avatar,
//             u2.id AS receiver_id,
//             u2.name AS receiver_name,
//             u2.image_url AS receiver_avatar
//         FROM tbl_messages m
//         JOIN tbl_message_sessions ms ON ms.id = m.message_session_id
//         LEFT JOIN tbl_users u1 ON m.sender_id = u1.id
//         LEFT JOIN tbl_users u2 ON m.receiver_id = u2.id
//         WHERE ms.user1_id = ? OR ms.user2_id = ?
//         ORDER BY m.created_at DESC;