import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form, Row, Col, Container } from 'react-bootstrap';
import { Bell, CheckCircle, Circle, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import io from 'socket.io-client';

const VITE_API_URL = import.meta.env.VITE_API_URL

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        hour12: true 
    };
    return date.toLocaleString(undefined, options);
}

function Notifications() {
    const { role, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const endpoint = role === "admin" 
                ? `${import.meta.env.VITE_ADMIN_NOTIFICATION}`
                : `${import.meta.env.VITE_USER_NOTIFICATION}/${user.id}`;
            
            const response = await axios.get(endpoint);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchNotifications();
        const socket = io(`${VITE_API_URL}`);
        socket.on("update", () => {
            fetchNotifications();
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const endpoint = role === "admin" 
                ? `http://localhost:5000/api/notifications/admin/mark-notification-read/${notificationId}`
                : `http://localhost:5000/api/notifications/mark-notification-read/${notificationId}`;
            
                await axios.put(endpoint);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const endpoint = role === "admin" 
                ? `http://localhost:5000/api/notifications/admin/remove-notification/${notificationId}`
                : `http://localhost:5000/api/notifications/remove-notification/${notificationId}`;
            await axios.delete(endpoint);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const endpoint = role === "admin" 
            ? `http://localhost:5000/api/notifications/admin/mark-all-notifications-read/`
            : `http://localhost:5000/api/notifications/mark-all-notifications-read/${user.id}`;
            await axios.put(endpoint);
            // await axios.put(`http://localhost:5000/api/notifications/mark-all-notifications-read/${user.id}`);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const getFilteredNotifications = () => {
        switch (filter) {
            case 'unread':
                return notifications.filter(n => n.is_read === 0);
            case 'read':
                return notifications.filter(n => n.is_read === 1);
            default:
                return notifications;
        }
    };

    const getNotificationColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'maintenance report': 
                return 'primary';
            case 'incident':
                return 'danger';
            case 'lost and found':
                return 'warning';
            case 'borrow item':
                return 'success';
            default:
                return 'info';
        }
    };

    return (
        <Container fluid className="p-4"> 
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <Bell className="me-2" />
                    Notifications
                </h2>
                <div className="d-flex gap-2">
                    <Form.Select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">All Notifications</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </Form.Select>
                    <Button 
                        variant="outline-primary"
                        onClick={markAllAsRead}
                        disabled={!notifications.some(n => n.is_read === 0)}
                    >
                        Mark All as Read
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : getFilteredNotifications().length === 0 ? (
                <Card className="text-center py-5">
                    <Card.Body>
                        <Bell size={48} className="text-muted mb-3" />
                        <h5>No notifications to display</h5>
                        <p className="text-muted">
                            {filter === 'all' 
                                ? "You're all caught up!" 
                                : `No ${filter} notifications`}
                        </p>
                    </Card.Body>
                </Card>
            ) : (
                <div className="notification-list">
                    {getFilteredNotifications().map((notification) => (
                        <Card 
                            key={notification.id} 
                            className={`mb-3 ${notification.is_read === 0 ? 'border-primary' : ''}`}
                        >
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <div className="d-flex align-items-center mb-2">
                                            <Badge 
                                                bg={getNotificationColor(notification.title)}
                                                className="me-2"
                                            >
                                                {notification.title || 'General'}
                                            </Badge>
                                            {notification.is_read === 0 ? (
                                                <Circle className="text-primary" />
                                            ) : (
                                                <CheckCircle className="text-muted" />
                                            )}
                                            <small className="text-muted ms-2">
                                                {formatDate(notification.created_at)}
                                            </small>
                                        </div>
                                        <Card.Title>{notification.title}</Card.Title>
                                        <Card.Text>{notification.message}</Card.Text>
                                    </Col>
                                    <Col xs="auto">
                                        <div className="d-flex gap-2">
                                            {notification.is_read === 0 && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    Mark as Read
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
}

export default Notifications;