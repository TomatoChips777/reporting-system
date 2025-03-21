import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form, Row, Col, Container, Modal } from 'react-bootstrap';
import { Bell, CheckCircle, Circle, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import io from 'socket.io-client';

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
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
        const socket = io(`${import.meta.env.VITE_API_URL}`);
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
                ? `${import.meta.env.VITE_ADMIN_READ_NOTIFICATION_API}/${notificationId}`
                : `${import.meta.env.VITE_USER_READ_NOTIFICATION_API}/${notificationId}`;

            await axios.put(endpoint);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
       setShowModal(false); 
    };

    const deleteNotification = async (notificationId) => {
        try {
            const endpoint = role === "admin"
                ? `${import.meta.env.VITE_ADMIN_DELETE_NOTIFICATION}/${notificationId}`
                : `${import.meta.env.VITE_USER_DELETE_NOTIFICATION}/${notificationId}`;
            await axios.delete(endpoint);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const endpoint = role === "admin"
                ? `${import.meta.env.VITE_ADMIN_MARK_ALL_NOTIFICATION}/`
                : `${import.meta.env.VITE_USER_MARK_ALL_NOTIFICATION}/${user.id}`;
            await axios.put(endpoint);
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

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setShowModal(true);
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
                            onClick={() => handleNotificationClick(notification)}  // Add onClick handler
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
                                    {/* <Col xs="auto">
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
                                    </Col> */}
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

              {/* Notification Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{selectedNotification ? selectedNotification.title : "Notification"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedNotification ? (
                        <div className="d-flex flex-column">
                            <div className="p-3 bg-light rounded mb-3">
                                <p className="mb-2">{selectedNotification.message}</p>
                                <small className="text-muted">{formatDate(selectedNotification.created_at)}</small>
                            </div>
                        </div>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    {selectedNotification && selectedNotification.is_read === 0 && (
                        <Button
                            variant="primary"
                            className='rounded-0'
                            size="sm"
                            onClick={() => markAsRead(selectedNotification.id)}
                        >
                            Mark as Read
                        </Button>
                    )}
                    <Button variant="secondary" className='rounded-0' size='sm' onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Notifications;
