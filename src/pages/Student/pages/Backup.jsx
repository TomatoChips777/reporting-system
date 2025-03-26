// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
// import { BsPersonCircle, BsSend, BsCheck2All, BsCheck2, BsPaperclip, BsCheckCircle, BsXCircle } from 'react-icons/bs';
// import { useAuth } from '../../../../AuthContext';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const Messages = () => {
//     const [messages, setMessages] = useState([]);
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [newMessage, setNewMessage] = useState('');
//     const { user } = useAuth();
//     const messagesEndRef = useRef(null);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const fileInputRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     const fetchItems = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/messages/get-messages/${user.id}`);
//             if (response.data.success) {
//                 setMessages(response.data.messages.map(convo => ({
//                     ...convo,
//                     lastMessage: convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : ''
//                 })));
//             }
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };

//     useEffect(() => {
//         const socket = io('http://localhost:5000');

//         socket.on('updateMessage', ({ senderId, receiverId, newMsg, report_id }) => {
//             setMessages(prevMessages => {
//                 let updated = false;

//                 const updatedMessages = prevMessages.map(convo => {
//                     if (convo.id === senderId || convo.id === receiverId) {
//                         updated = true;
//                         return {
//                             ...convo,
//                             lastMessage: newMsg.text,
//                             messages: [...convo.messages, newMsg]
//                         };
//                     }
//                     return convo;
//                 });

//                 return updated ? updatedMessages : [...prevMessages, {
//                     id: user.id === senderId ? receiverId : senderId,
//                     user: {
//                         id: user.id === senderId ? receiverId : senderId,
//                         name: newMsg.senderId === senderId ? newMsg.receiverName : newMsg.senderName,
//                         avatar: newMsg.senderId === senderId ? newMsg.receiverAvatar : newMsg.senderAvatar
//                     },
//                     lastMessage: newMsg.text,
//                     created_at: newMsg.created_at,
//                     unread: 1,
//                     messages: [newMsg]
//                 }];
//             });
//             console.log(selectedConversation);

//             // Update selected conversation if it's the active chat
//             if (selectedConversation && (selectedConversation.id === senderId || selectedConversation.id === receiverId && selectedConversation.report_id === report_id)) {
//                 console.log(selectedConversation);
//                 setSelectedConversation(prev => ({
//                     ...prev,
//                     // messages: [...prev.messages, newMsg]
//                     messages: selectedConversation.report_id === report_id && selectedConversation.id === senderId || selectedConversation.id === receiverId
//                     ? [...prev.messages] 
//                     : [...prev.messages, newMsg] 

//                 }));
//             }
//         });

//         scrollToBottom();

//         fetchItems();

//         return () => {
//             socket.disconnect();
//         };
//     }, [user.id, selectedConversation, selectedConversation?.message]);

//     const formatTime = (created_at) => {
//         return new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };
//     const handleFileChange = (e) => {
//         if (e.target.files.length > 0) {
//             setSelectedImage(e.target.files[0]);
//         }
//     };

//     const handleFileButtonClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleSendMessage = async (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() && !selectedImage) return;

//         const formData = new FormData();
//         formData.append("sender_id", user.id);
//         formData.append("receiver_id", selectedConversation.id);
//         formData.append("message", newMessage);
//         formData.append("report_id", selectedConversation.report_id);
//         if (selectedImage) {
//             formData.append("image", selectedImage);
//         }

//         console.log(formData);
//         try {
//             const response = await axios.post('http://localhost:5000/api/messages/send-message', formData, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             });

//             if (response.data.success) {
//                 const newMsg = response.data.message;
//                 setNewMessage('');
//                 setSelectedImage(null);
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleClaimAction = async (messageId, action) => {
//         try {
//             const response = await axios.post(`http://localhost:5000/api/messages/claim-action`, {
//                 messageId,
//                 action,
//                 userId: user.id
//             });

//             if (response.data.success) {
//                 // Update the message status locally
//                 setSelectedConversation(prev => ({
//                     ...prev,
//                     messages: prev.messages.map(msg =>
//                         msg.id === messageId
//                             ? { ...msg, claimStatus: action }
//                             : msg
//                     )
//                 }));
//             }
//         } catch (error) {
//             console.error('Error handling claim action:', error);
//         }
//     };

//     return (
//         <Container fluid className="messages-page p-4">
//             <Row className="h-100">
//                 <Col md={4} className="conversations-list">
//                     <Card className="h-100">
//                         <Card.Header className="bg-success text-white">
//                             <h5 className="mb-0">Messages</h5>
//                         </Card.Header>
//                         <Card.Body className="p-0">
//                             <div className="conversation-items">
//                                 {messages.map((conversation) => (
//                                     <div
//                                         key={`${conversation.report_id}-${conversation.id}`} // Unique key per report
//                                         className={`conversation-item p-3 ${selectedConversation?.id === conversation.id && selectedConversation?.report_id === conversation.report_id ? 'active' : ''}`}
//                                         onClick={() => setSelectedConversation(conversation)}
//                                     >
//                                         <div className="d-flex align-items-center">
//                                             <div className="avatar-container">
//                                                 {conversation.user?.avatar ? (
//                                                     <img src={conversation.user.avatar} width="40" height="40" className="rounded-circle" alt="User" />
//                                                 ) : (
//                                                     <BsPersonCircle size={40} className="text-secondary" />
//                                                 )}
//                                             </div>
//                                             <div className="ms-3 flex-grow-1">
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <h6 className="mb-0">{conversation.user?.name || 'Unknown'}</h6>
//                                                     <small className="text-muted">
//                                                         {formatTime(conversation.created_at)}
//                                                     </small>
//                                                 </div>
//                                                 <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
//                                                     {conversation.lastMessage || 'No messages yet'}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}

//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={8}>
//                     <Card className="h-100">
//                         {selectedConversation ? (
//                             <>
//                                 <Card.Header className="bg-light">
//                                     <div className="d-flex align-items-center">
//                                         {selectedConversation.user?.avatar ? (
//                                             <img src={selectedConversation.user.avatar} width="40" height="40" className="rounded-circle" alt="User" />
//                                         ) : (
//                                             <BsPersonCircle size={40} className="text-secondary" />
//                                         )}
//                                         <div className="ms-3">
//                                             <h6 className="mb-0">{selectedConversation.user?.name || 'Unknown'}</h6>
//                                             {/* <small className="text-muted">Online</small> */}
//                                         </div>
//                                     </div>
//                                 </Card.Header>
//                                 <Card.Body className="chat-body">
//                                     <div className="messages-container">
//                                         {selectedConversation.messages.map((message) => (
//                                             <div
//                                                 key={message.id}
//                                                 className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
//                                             >
//                                                 <div className="message-content">
//                                                     {/* Display Text */}
//                                                     {message.text && message.text.trim() && (
//                                                         <div className="message-bubble">
//                                                             {message.text}
                                                            
//                                                             <div className="message-meta">
//                                                                 <small className="text-muted">{formatTime(message.created_at)}</small>
//                                                                 {message.senderId === user.id && (
//                                                                     <span className="ms-1">
//                                                                         {message.status === 'read' ? (
//                                                                             <BsCheck2All className="text-primary" />
//                                                                         ) : (
//                                                                             <BsCheck2 className="text-muted" />
//                                                                         )}
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {/* Display claim action card */}
//                                                     {message.type === 'claim' && message.receiverId === user.id && !message.claimStatus && (
//                                                         <Card className="claim-action-card mt-2">
//                                                             <Card.Body>
//                                                                 <div className="d-flex justify-content-between align-items-center">
//                                                                     <span>Item Claim Request</span>
//                                                                     <div>
//                                                                         <Button
//                                                                             variant="success"
//                                                                             className="me-2"
//                                                                             onClick={() => handleClaimAction(message.id, 'accepted')}
//                                                                         >
//                                                                             <BsCheckCircle className="me-1" /> Accept
//                                                                         </Button>
//                                                                         <Button
//                                                                             variant="danger"
//                                                                             onClick={() => handleClaimAction(message.id, 'rejected')}
//                                                                         >
//                                                                             <BsXCircle className="me-1" /> Reject
//                                                                         </Button>
//                                                                     </div>
//                                                                 </div>
//                                                             </Card.Body>
//                                                         </Card>
//                                                     )}

//                                                     {/* Display claim status if action was taken */}
//                                                     {message.type === 'claim' && message.claimStatus && (
//                                                         <div className={`claim-status mt-2 text-${message.claimStatus === 'accepted' ? 'success' : 'danger'}`}>
//                                                             <small>
//                                                                 {message.claimStatus === 'accepted' ? (
//                                                                     <><BsCheckCircle className="me-1" /> Claim Accepted</>
//                                                                 ) : (
//                                                                     <><BsXCircle className="me-1" /> Claim Rejected</>
//                                                                 )}
//                                                             </small>
//                                                         </div>
//                                                     )}

//                                                     {/* Display Image (if available) below the text */}
//                                                     {message.image_path && (
//                                                         <div className="image-container">
//                                                             <img
//                                                                 src={`http://localhost:5000/uploads/${message.image_path}`}
//                                                                 alt="Sent"
//                                                                 className="message-image"
//                                                             />
//                                                         </div>
//                                                     )}

//                                                 </div>
//                                             </div>
//                                         ))}
//                                         <div ref={messagesEndRef} />
//                                     </div>
//                                 </Card.Body>
//                                 <Card.Footer className="bg-light">
//                                     <Form onSubmit={handleSendMessage}>
//                                         <InputGroup>
//                                             <Button variant="light" onClick={handleFileButtonClick}>
//                                                 <BsPaperclip />
//                                             </Button>
//                                             <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="Type a message..."
//                                                 value={newMessage}
//                                                 onChange={(e) => setNewMessage(e.target.value)}
//                                             />
//                                             <Button type="submit" variant="primary" disabled={!newMessage.trim() && !selectedImage}>
//                                                 <BsSend />
//                                             </Button>
//                                         </InputGroup>
//                                     </Form>
//                                 </Card.Footer>
//                             </>

//                         ) : (

//                             <Card.Body className="d-flex align-items-center justify-content-center text-muted">
//                                 <div className="text-center">
//                                     <BsPersonCircle size={50} />
//                                     <h5 className="mt-3">Select a conversation to start messaging</h5>
//                                 </div>
//                             </Card.Body>
//                         )}
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };
// export default Messages;


import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { BsPersonCircle, BsSend, BsCheck2All, BsCheck2, BsPaperclip, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { useAuth } from '../../../../AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/get-messages/${user.id}`);
            if (response.data.success) {
                setMessages(response.data.messages.map(convo => ({
                    ...convo,
                    lastMessage: convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : ''
                })));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('updateMessage', ({ senderId, receiverId, newMsg, message_session_id }) => {

            if(user.id === senderId || user.id === receiverId){
            setMessages(prevMessages => {
                let updated = false;

                const updatedMessages = prevMessages.map(convo => {
                    if (convo.senderId === senderId || convo.receiverId === receiverId) {
                        updated = true;
                        return {
                            ...convo,
                            // lastMessage: newMsg.text,
                            messages: [...convo.messages, newMsg]
                        };
                    }
                    return convo;
                });

                return updated ? updatedMessages : [...prevMessages, {
                    id: user.id === senderId ? receiverId : senderId,
                    user: {
                        id: user.id === senderId ? receiverId : senderId,
                        name: newMsg.senderId === senderId ? newMsg.receiverName : newMsg.senderName,
                        avatar: newMsg.senderId === senderId ? newMsg.receiverAvatar : newMsg.senderAvatar
                    },
                    senderId: newMsg.senderId,
                    receiverId: newMsg.receiverId,
                    lastMessage: newMsg.text,
                    created_at: newMsg.created_at,
                    unread: 1,
                    messages: [newMsg]
                }];
            });
            console.log(selectedConversation);

            // Update selected conversation if it's the active chat
            if (selectedConversation && (selectedConversation.id === senderId || selectedConversation.receiverId === receiverId)) {
                console.log(selectedConversation);
                setSelectedConversation(prev => ({
                    ...prev,
                    // messages: [...prev.messages, newMsg]
                    messages: selectedConversation.message_session_id === message_session_id
                    ? [...prev.messages] 
                    : [...prev.messages, newMsg] 

                }));
            }else{
                fetchItems();
            }
        }

        });

        scrollToBottom();

        fetchItems();

        return () => {
            socket.disconnect();
        };
    }, [user.id, selectedConversation, selectedConversation?.message]);

    const formatTime = (created_at) => {
        return new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSendMessage = async (e) => {
        console.log(selectedConversation);
        e.preventDefault();
        if (!newMessage.trim() && !selectedImage) return;

        const formData = new FormData();
        formData.append("sender_id", user.id);
        formData.append("receiver_id", selectedConversation.receiverId);
        formData.append("message", newMessage);
        formData.append("report_id", selectedConversation.report_id);
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        console.log(formData);
        try {
            const response = await axios.post('http://localhost:5000/api/messages/send-message', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                const newMsg = response.data.message;
                setNewMessage('');
                setSelectedImage(null);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleClaimAction = async (messageId, action) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/messages/claim-action`, {
                messageId,
                action,
                userId: user.id
            });

            if (response.data.success) {
                // Update the message status locally
                setSelectedConversation(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg =>
                        msg.id === messageId
                            ? { ...msg, claimStatus: action }
                            : msg
                    )
                }));
            }
        } catch (error) {
            console.error('Error handling claim action:', error);
        }
    };

    return (
        <Container fluid className="messages-page p-4">
            <Row className="h-100">
                <Col md={4} className="conversations-list">
                    <Card className="h-100">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Messages</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="conversation-items">
                                {messages.map((conversation) => (
                                    <div
                                        key={`${conversation.report_id}-${conversation.id}`} // Unique key per report
                                        className={`conversation-item p-3 ${selectedConversation?.id === conversation.id && selectedConversation?.report_id === conversation.report_id ? 'active' : ''}`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-container">
                                                {conversation.user?.avatar ? (
                                                    <img src={conversation.user.avatar} width="40" height="40" className="rounded-circle" alt="User" />
                                                ) : (
                                                    <BsPersonCircle size={40} className="text-secondary" />
                                                )}
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">{conversation.user?.name || 'Unknown'}</h6>
                                                    <small className="text-muted">
                                                        {formatTime(conversation.created_at)}
                                                    </small>
                                                </div>
                                                <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                                    {conversation.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="h-100">
                        {selectedConversation ? (
                            <>
                                <Card.Header className="bg-light">
                                    <div className="d-flex align-items-center">
                                        {selectedConversation.user?.avatar ? (
                                            <img src={selectedConversation.user.avatar} width="40" height="40" className="rounded-circle" alt="User" />
                                        ) : (
                                            <BsPersonCircle size={40} className="text-secondary" />
                                        )}
                                        <div className="ms-3">
                                            <h6 className="mb-0">{selectedConversation.user?.name || 'Unknown'}</h6>
                                            {/* <small className="text-muted">Online</small> */}
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="chat-body">
                                    <div className="messages-container">
                                        {selectedConversation.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
                                            >
                                                <div className="message-content">
                                                    {/* Display Text */}
                                                    {message.text && message.text.trim() && (
                                                        <div className="message-bubble">
                                                            {message.text}
                                                            
                                                            <div className="message-meta">
                                                                <small className="text-muted">{formatTime(message.created_at)}</small>
                                                                {message.senderId === user.id && (
                                                                    <span className="ms-1">
                                                                        {message.status === 'read' ? (
                                                                            <BsCheck2All className="text-primary" />
                                                                        ) : (
                                                                            <BsCheck2 className="text-muted" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Display claim action card */}
                                                    {message.type === 'claim' && message.receiverId === user.id && !message.claimStatus && (
                                                        <Card className="claim-action-card mt-2">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <span>Item Claim Request</span>
                                                                    <div>
                                                                        <Button
                                                                            variant="success"
                                                                            className="me-2"
                                                                            onClick={() => handleClaimAction(message.id, 'accepted')}
                                                                        >
                                                                            <BsCheckCircle className="me-1" /> Accept
                                                                        </Button>
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() => handleClaimAction(message.id, 'rejected')}
                                                                        >
                                                                            <BsXCircle className="me-1" /> Reject
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    )}

                                                    {/* Display claim status if action was taken */}
                                                    {message.type === 'claim' && message.claimStatus && (
                                                        <div className={`claim-status mt-2 text-${message.claimStatus === 'accepted' ? 'success' : 'danger'}`}>
                                                            <small>
                                                                {message.claimStatus === 'accepted' ? (
                                                                    <><BsCheckCircle className="me-1" /> Claim Accepted</>
                                                                ) : (
                                                                    <><BsXCircle className="me-1" /> Claim Rejected</>
                                                                )}
                                                            </small>
                                                        </div>
                                                    )}

                                                    {/* Display Image (if available) below the text */}
                                                    {message.image_path && (
                                                        <div className="image-container">
                                                            <img
                                                                src={`http://localhost:5000/uploads/${message.image_path}`}
                                                                alt="Sent"
                                                                className="message-image"
                                                            />
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-light">
                                    <Form onSubmit={handleSendMessage}>
                                        <InputGroup>
                                            <Button variant="light" onClick={handleFileButtonClick}>
                                                <BsPaperclip />
                                            </Button>
                                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                                            <Form.Control
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            />
                                            <Button type="submit" variant="primary" disabled={!newMessage.trim() && !selectedImage}>
                                                <BsSend />
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </Card.Footer>
                            </>

                        ) : (

                            <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                                <div className="text-center">
                                    <BsPersonCircle size={50} />
                                    <h5 className="mt-3">Select a conversation to start messaging</h5>
                                </div>
                            </Card.Body>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default Messages;
