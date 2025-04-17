import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Dash } from 'react-bootstrap-icons';
import { BsRobot } from 'react-icons/bs';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
const FloatingChat = ({ reportType = 'maintenance' }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 224, y: 150 });

  const messagesEndRef = useRef(null);
  const chatboxRef = useRef(null);
  const headerRef = useRef(null);


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/chatbot-conversation/${user?.id}?category=${reportType}`);
        setMessages(response.data.messages);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchChatHistory();
  }, [user.id]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const chatbox = chatboxRef.current;
    const dragHandle = headerRef.current || chatboxRef.current;
    if (!chatbox || !dragHandle) return;
  
    let offsetX = 0, offsetY = 0, isDragging = false;
  
    const onMouseDown = (e) => {
      const rect = chatbox.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = true;
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  
    const onMouseMove = (e) => {
      if (!isDragging) return;
  
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
  
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      const boxWidth = chatbox.offsetWidth;
      const boxHeight = chatbox.offsetHeight;
  
      const clampedX = Math.max(0, Math.min(windowWidth - boxWidth, newX));
      const clampedY = Math.max(0, Math.min(windowHeight - boxHeight, newY));
  
      setPosition({ x: clampedX, y: clampedY });
    };
  
    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    dragHandle.addEventListener('mousedown', onMouseDown);
    return () => {
      dragHandle.removeEventListener('mousedown', onMouseDown);
    };
  }, [isOpen]);
  

  // useEffect(() => {
  //   const element = dragRef.current;
  //   if (!element) return;

  //   let offsetX = 0, offsetY = 0, isDragging = false;

  //   const onMouseDown = (e) => {
  //     const rect = element.getBoundingClientRect();
  //     offsetX = e.clientX - rect.left;
  //     offsetY = e.clientY - rect.top;
  //     isDragging = true;

  //     document.addEventListener('mousemove', onMouseMove);
  //     document.addEventListener('mouseup', onMouseUp);
  //   };

  //   const onMouseMove = (e) => {
  //     if (!isDragging) return;

  //     const newX = e.clientX - offsetX;
  //     const newY = e.clientY - offsetY;

  //     const windowWidth = window.innerWidth;
  //     const windowHeight = window.innerHeight;

  //     const boxWidth = element.offsetWidth;
  //     const boxHeight = element.offsetHeight;

  //     const clampedX = Math.max(0, Math.min(windowWidth - boxWidth, newX));
  //     const clampedY = Math.max(0, Math.min(windowHeight - boxHeight, newY));

  //     setPosition({ x: clampedX, y: clampedY });
  //   };

  //   const onMouseUp = () => {
  //     isDragging = false;
  //     document.removeEventListener('mousemove', onMouseMove);
  //     document.removeEventListener('mouseup', onMouseUp);
  //   };

  //   element.addEventListener('mousedown', onMouseDown);
  //   return () => {
  //     element.removeEventListener('mousedown', onMouseDown);
  //   };
  // }, [isOpen]);


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
    const recentMessages = messages.slice(-3);
    console.log("Recent: ", recentMessages);
    try {
      const res = await axios.post(`${import.meta.env.VITE_OLLAMA_ANALYZER}`, {
        userId: user.id,
        reportType,
        question: message,
        history: recentMessages,
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
    <div
      ref={chatboxRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1050,
        userSelect: 'none',
      }}
    >

                {isOpen ? (
                  <Card style={styles.chatBox}>
                    <Card.Header ref={headerRef} className="d-flex justify-content-between align-items-center bg-primary text-white" style={{ cursor: 'move' }}>
                      Chat Assistant
                      <Dash
            role="button"
            size={24}
            onClick={() => {
              setIsOpen(false);
            }}
          />

            {/* <Dash
              role="button"
              size={24}
              onClick={() => setIsOpen(false)}
            /> */}
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
        ref={headerRef}
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          style={styles.button}
        >
          <BsRobot size={20} />
        </Button>
      )}
    </div>
  );
};

const styles = {
  chatBox: {
    width: '620px',
    height: '580px',
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
    minHeight: 0,
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
  },
  button: {
    borderRadius: '50%',
    padding: '0.75rem 1rem',
    fontSize: '1.25rem',
  },
};

export default FloatingChat;
