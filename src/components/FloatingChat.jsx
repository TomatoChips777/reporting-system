import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Dash } from 'react-bootstrap-icons';
import { BsRobot } from 'react-icons/bs';
import axios from 'axios';
const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const typeBotReply = (text) => {
        return new Promise((resolve) => {
            let currentText = '';
            let index = 0;
    
            const interval = setInterval(() => {
                currentText += text[index];
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { sender: 'bot', text: currentText };
                    return updated;
                });
    
                index++;
                scrollToBottom();
    
                if (index >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 2);
        });
    };
    

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const userMsg = { sender: 'user', text: message };
        const loadingMsg = { sender: 'bot', text: <Spinner animation="border" size="sm" /> };
        setMessages(prev => [...prev, userMsg, loadingMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_OLLAMA_ANALYZER}`, {
                reportType: 'maintenance',
                question: message
            });

            const botReply = res.data?.answer || 'Sorry, I could not understand that.';
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: 'bot', text: '' };
                return updated;
            });
            await typeBotReply(botReply);
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: 'bot', text: '⚠️ Failed to contact the server.' };
                return updated;
            });
        }

        setIsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={styles.container}>
            {isOpen ? (
                <Card style={styles.chatBox}>
                    <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                        Chat Assistant
                        <Dash
                            role="button"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsOpen(false)}
                        />

                    </Card.Header>
                    <Card.Body style={styles.body}>
                        <div style={styles.messagesContainer}>
                            <div style={styles.scrollArea}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...styles.messageBubble,
                                                backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef',
                                                color: msg.sender === 'user' ? 'white' : 'black',
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div style={{ alignSelf: 'flex-start', color: '#555', fontStyle: 'italic' }}>
                                        {/* <Spinner animation="border" size="sm" /> */}
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            style={{ marginTop: 'auto' }}
                        />
                    </Card.Body>
                </Card>
            ) : (
                <Button
                    onClick={() => {
                        setIsOpen(true);
                        setTimeout(() => {
                            scrollToBottom();
                        }, 100);
                    }}
                    style={styles.button}
                >
                    <BsRobot size={40} />
                </Button>
            )}
        </div>
    );
};
const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1050,
    },
    chatBox: {
        width: '620px',
        height: '680px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '0.5rem',
        gap: '0.5rem',
        minHeight: 0, // Prevent content from overflowing
    },
    messagesContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    scrollArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingRight: '0.5rem',
        paddingBottom: '0.5rem',
        gap: '0.5rem',
    },

    messageBubble: {
        maxWidth: '80%',
        padding: '0.5rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.875rem',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        borderTopLeftRadius: '1rem',
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
        borderBottomLeftRadius: '1rem',
    },
    button: {
        borderRadius: '50%',
        padding: '0.75rem 1rem',
        fontSize: '1.25rem',
    },
};

export default FloatingChat;
