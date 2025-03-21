import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { BsPersonCircle, BsSend, BsCheck2All, BsCheck2 } from 'react-icons/bs';
import { useAuth } from '../../../../AuthContext';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();

    // Dummy data for conversations
    const dummyConversations = [
        {
            id: 1,
            user: {
                id: 2,
                name: 'John Smith',
                avatar: null
            },
            lastMessage: 'Hi, I found your lost laptop at the library.',
            timestamp: '2025-03-18T07:30:00',
            unread: 2,
            messages: [
                {
                    id: 1,
                    senderId: 2,
                    text: 'Hi, I found your lost laptop at the library.',
                    timestamp: '2025-03-18T07:30:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Oh thank you so much! Can you describe it?',
                    timestamp: '2025-03-18T07:35:00',
                    status: 'read'
                },
                {
                    id: 3,
                    senderId: 2,
                    text: 'It\'s a silver MacBook Pro with a black case.',
                    timestamp: '2025-03-18T07:36:00',
                    status: 'unread'
                }
            ]
        },
        {
            id: 2,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 3,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 4,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 5,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 6,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 7,
            user: {
                id: 2,
                name: 'John Smith',
                avatar: null
            },
            lastMessage: 'Hi, I found your lost laptop at the library.',
            timestamp: '2025-03-18T07:30:00',
            unread: 2,
            messages: [
                {
                    id: 1,
                    senderId: 2,
                    text: 'Hi, I found your lost laptop at the library.',
                    timestamp: '2025-03-18T07:30:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Oh thank you so much! Can you describe it?',
                    timestamp: '2025-03-18T07:35:00',
                    status: 'read'
                },
                {
                    id: 3,
                    senderId: 2,
                    text: 'It\'s a silver MacBook Pro with a black case.',
                    timestamp: '2025-03-18T07:36:00',
                    status: 'unread'
                }
            ]
        },
        {
            id: 8,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 9,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 10,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 11,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        },
        {
            id: 12,
            user: {
                id: 3,
                name: 'Sarah Johnson',
                avatar: null
            },
            lastMessage: 'I think I found your student ID card.',
            timestamp: '2025-03-18T06:45:00',
            unread: 1,
            messages: [
                {
                    id: 1,
                    senderId: 3,
                    text: 'I think I found your student ID card.',
                    timestamp: '2025-03-18T06:45:00',
                    status: 'read'
                },
                {
                    id: 2,
                    senderId: 1,
                    text: 'Really? Where did you find it?',
                    timestamp: '2025-03-18T06:50:00',
                    status: 'read'
                }
            ]
        }
    ];

    useEffect(() => {
        setMessages(dummyConversations);
    }, []);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            senderId: user.id,
            text: newMessage,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        setSelectedConversation(prev => ({
            ...prev,
            messages: [...prev.messages, newMsg],
            lastMessage: newMessage
        }));

        setNewMessage('');
    };

    return (
        <Container fluid className="messages-page p-4">
            <Row className="h-100">
                <Col md={4} className="conversations-list">
                    <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Messages</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="conversation-items">
                                {messages.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`conversation-item p-3 ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-container">
                                                <BsPersonCircle size={40} className="text-secondary" />
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">{conversation.user.name}</h6>
                                                    <small className="text-muted">
                                                        {formatTime(conversation.timestamp)}
                                                    </small>
                                                </div>
                                                <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                                    {conversation.lastMessage}
                                                </p>
                                            </div>
                                            {conversation.unread > 0 && (
                                                <Badge bg="primary" pill className="ms-2">
                                                    {conversation.unread}
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
                                        <BsPersonCircle size={40} className="text-secondary" />
                                        <div className="ms-3">
                                            <h6 className="mb-0">{selectedConversation.user.name}</h6>
                                            <small className="text-muted">Online</small>
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
                                                <div className="message-bubble">
                                                    {message.text}
                                                    <div className="message-meta">
                                                        <small className="text-muted">
                                                            {formatTime(message.timestamp)}
                                                        </small>
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
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-light ">
                                    <Form onSubmit={handleSendMessage}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNe(e.target.value)}
                                            />
                                            <Button type="submit" variant="primary" disabled={!newMessage.trim()}>
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