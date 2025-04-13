import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { BsPersonCircle, BsSend, BsCheck2All, BsCheck2, BsPaperclip, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import formatDate from '../../functions/DateFormat';
import { useLocation } from 'react-router-dom';

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
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_MESSAGES}/${user.id}`);
            if (response.data.success) {
                setMessages(response.data.messages.map(convo => {
                    const unreadCount = convo.messages.filter(msg =>
                        msg.status !== 'read' && msg.receiverId === user.id
                    ).length;
                    return {
                        ...convo,
                        lastMessage: convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : '',
                        unreadCount 
                    };
                }));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on('updateMessage', ({ senderId, receiverId, newMsg, report_id, message_session_id }) => {

            if (user.id === senderId || user.id === receiverId) {
                setMessages(prevMessages => {
                    let updated = false;

                    const updatedMessages = prevMessages.map(convo => {
                        if (convo.message_session_id === message_session_id) {

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
                        item_type: newMsg.item_type,
                        action: newMsg.action,
                        unread: 1,
                        messages: [newMsg]
                    }];
                });

                // Update selected conversation if it's the active chat
                if (selectedConversation && (selectedConversation.message_session_id === message_session_id)) {
                    // console.log(selectedConversation);
                    setSelectedConversation(prev => ({
                        ...prev,
                        // messages: [...prev.messages, newMsg]
                        messages: selectedConversation.report_id === report_id
                            ? [...prev.messages]
                            : [...prev.messages, newMsg]

                    }));
                } else {
                    fetchMessages();
                }
            }

        });
        scrollToBottom();
        fetchMessages().then(() => {
            setMessages(prevMessages => {
              const found = prevMessages.find(m =>
                m.report_id === selectedConversation?.report_id &&
                m.message_session_id === selectedConversation?.message_session_id
              );
              if (!found) {
                setSelectedConversation(null);
              }
              return prevMessages;
            });
          });

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
        e.preventDefault();
        if (!newMessage.trim() && !selectedImage) return;
        try {
            // Mark unread messages as read first
            await axios.post(`${import.meta.env.VITE_MARK_AS_READ_MESSAGES}`, {
                senderId: selectedConversation.id, // The person who sent the unread messages
                receiverId: user.id, // Current user
                message_session_id: selectedConversation.message_session_id
            });
            // Reset unread count in UI
            setMessages(prevMessages => prevMessages.map(convo =>
                convo.message_session_id === selectedConversation.message_session_id
                    ? { ...convo, unreadCount: 0 }
                    : convo
            ));
            // Proceed with sending the new message
            const formData = new FormData();
            formData.append("sender_id", user.id);
            formData.append("receiver_id", selectedConversation.id);
            formData.append("message", newMessage);
            formData.append("report_id", selectedConversation.report_id);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await axios.post(`${import.meta.env.VITE_SEND_MESSAGE}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setNewMessage('');
                setSelectedImage(null);
            }
        } catch (error) {
            console.error('Error sending message or marking as read:', error);
        }
    };
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        // If there are unread messages, mark them as read
        if (conversation.unreadCount > 0) {
            try {
                await axios.post(`${import.meta.env.VITE_MARK_AS_READ_MESSAGES}`, {
                    senderId: conversation.id,  // User who sent the messages
                    receiverId: user.id,  // Current user (who is reading)
                    message_session_id: conversation.message_session_id // Ensure only this conversation is updated
                });
                // Update messages state: Set unreadCount to 0
                setMessages(prevMessages => prevMessages.map(convo =>
                    convo.id === conversation.id && convo.message_session_id === conversation.message_session_id
                        ? { ...convo, unreadCount: 0 }
                        : convo
                ));
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }
    };
    return (
        <Container fluid className="messages-page p-4">
            <Row className="h-100">
                <Col md={4} className="conversations-list ">
                    <Card className="h-100">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Messages</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="conversation-items rounded" >
                                {messages.map((conversation) => (
                                    <div
                                        key={`${conversation.report_id}-${conversation.id}`}
                                        className={`conversation-item p-3 ${selectedConversation?.id === conversation.id && selectedConversation?.report_id === conversation.report_id ? 'active' : ''}`}
                                        onClick={() => handleSelectConversation(conversation)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-container">
                                                {conversation.user?.id === "anonymous" ? (
                                                    <BsPersonCircle size={40} className="text-secondary" />
                                                ) : (
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGES}/${conversation.user?.avatar}`}
                                                        width="40"
                                                        height="40"
                                                        className="rounded-circle"
                                                        alt="User"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="mb-0">
                                                        {conversation.user?.name || 'Unknown'}
                                                        <span className="text-muted">
                                                            {(() => {
                                                                const text = `${conversation.item_type.charAt(0).toUpperCase() + conversation.item_type.slice(1).toLowerCase()} - ${conversation.item_name}`;
                                                                return `[${text.length > 15 ? text.substring(0, 15) + "..." : text}]`;
                                                            })()}
                                                        </span>
                                                    </small>
                                                    <small className="text-muted">
                                                        {formatDate(conversation.created_at)}
                                                    </small>
                                                </div>
                                                <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                                    {conversation.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                            {conversation.unreadCount > 0 && (
                                                <Badge bg="danger" pill className="ms-2"> 
                                                    {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                                                </Badge>
                                            )}
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
                                            <img src={`${import.meta.env.VITE_IMAGES}/${selectedConversation.user?.avatar}`} width="40" height="40" className="rounded-circle" alt="User" />
                                        ) : (
                                            <BsPersonCircle size={40} className="text-secondary" />
                                        )}
                                        <div className="ms-3">
                                            <h6 className="mb-0">
                                                {selectedConversation.user?.name || 'Unknown'}
                                                <span className="text-muted"> [{selectedConversation.item_type.charAt(0).toUpperCase() + selectedConversation.item_type.slice(1).toLowerCase()}  - {selectedConversation.item_name}]</span>
                                            </h6>
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
                                                    {message.image_path && (
                                                        <div className="image-container">
                                                            <img
                                                                src={`${import.meta.env.VITE_IMAGES}/${message.image_path}`}
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
                                    <h5 className="mt-3">No conversation</h5>
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
