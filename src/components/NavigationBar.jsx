import { Navbar, Nav, Container, Dropdown, Badge, Modal, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import { Bell } from 'react-bootstrap-icons';
import axios from 'axios';
import io from 'socket.io-client';

function NavigationBar() {
    const { user, signOut, role } = useAuth();
    const { getCurrentSection, setSectionByPath, pathToSection } = useNavigation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Update section based on current path when component mounts or path changes
    useEffect(() => {
        if (location.pathname && pathToSection[location.pathname]) {
            setSectionByPath(location.pathname);
        }
    }, [location.pathname, setSectionByPath, pathToSection]);

    const fetchNotifications = async () => {
        try {
            if (role === "admin") {
                const response = await axios.get("http://localhost:5000/api/notifications/get-admin-notifications");
                setNotifications(response.data);
            } else {
                const response = await axios.get(`http://localhost:5000/api/notifications/get-notifications/${user.id}`);
                // setNotifications(response.data);
                const unreadNotifications = response.data.filter(notification => notification.is_read === 0);
                setNotifications(unreadNotifications);
            }

        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    useEffect(() => {
        
        fetchNotifications();
        const socket = io("http://localhost:5000");
        socket.on("update", () => {
            fetchNotifications();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleNotificationClick = async (notif) => {
        setSelectedNotification(notif);
        setShowModal(true);
        if (!notif.is_read) {

            try {
                if (role === "admin") {
                    const response = await axios.put(`http://localhost:5000/api/notifications/admin/mark-notification-read/${notif.id}`);
                    if (response.success) {
                        fetchNotifications();
                    }
                } else {
                    const response = await axios.put(`http://localhost:5000/api/notifications/mark-notification-read/${notif.id}`);
                    if (response.success) {
                        fetchNotifications();
                    }
                }
            } catch (error) {
                console.log("Error marking notification", error)
            }

        }
    };
    const markAllAsRead = () => {
        setNotifications([]);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const getTimeAgo = (timestamp) => {
        const createdAt = new Date(timestamp);
        const now = new Date();
        const differenceInSeconds = Math.floor((now - createdAt) / 1000);

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} sec ago`;
        } else if (differenceInSeconds < 3600) {
            return `${Math.floor(differenceInSeconds / 60)} min ago`;
        } else if (differenceInSeconds < 86400) {
            return `${Math.floor(differenceInSeconds / 3600)} hrs ago`;
        } else if (differenceInSeconds < 2592000) {
            return `${Math.floor(differenceInSeconds / 86400)} days ago`;
        } else if (differenceInSeconds < 31536000) {
            return `${Math.floor(differenceInSeconds / 2592000)} months ago`;
        } else {
            return `${Math.floor(differenceInSeconds / 31536000)} years ago`;
        }
    };


    return (
        <>
            <Navbar bg="success" variant="dark" expand="lg" sticky="top">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarSupportedContent" />
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto">
                            <Nav.Link 
                                as={Link} 
                                to="/home" 
                                className={location.pathname === "/home" ? "active" : ""}
                                onClick={() => setSectionByPath('/home')}
                            >
                                Home
                            </Nav.Link>
                            
                            {getCurrentSection().routes.map((route) => (
                                <Nav.Link
                                    key={route.path}
                                    as={Link}
                                    to={route.path}
                                    className={location.pathname === route.path ? "active" : ""}
                                    onClick={() => setSectionByPath(route.path)}
                                >
                                    {route.name}
                                </Nav.Link>
                            ))}
                        </Nav> 

                        {/* Notifications Dropdown */}
                        <Dropdown show={showNotifications} onToggle={(isOpen) => setShowNotifications(isOpen)}>
                            <Dropdown.Toggle as="div" className="position-relative text-white me-3">
                                <Bell size={24} style={{ cursor: 'pointer' }} />
                                {notifications.length > 0 && (
                                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="dropdown-menu-end" style={{ minWidth: "250px" }}>
                                <Dropdown.Header>Notifications</Dropdown.Header>
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <Dropdown.Item
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`d-flex flex-column p-2 ${notif.is_read ? "text-muted" : "fw-bold"}`}
                                            style={{ fontSize: "0.875rem", lineHeight: "1.2", whiteSpace: "normal" }}
                                        >
                                            <small>{notif.title}</small>

                                            <span className="text-truncate">
                                                {notif.message.length > 35 ? `${notif.message.substring(0, 35)}...` : notif.message}
                                            </span>
                                            <small className="text-muted">{getTimeAgo(notif.created_at)}</small>
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item className="text-center text-muted">No notifications</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* User Profile Dropdown */}
                        {user && (
                            <Dropdown show={showUserMenu} onToggle={(isOpen) => setShowUserMenu(isOpen)}>
                                <Dropdown.Toggle as="div" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                    <img src={user.image_url} width="40" height="40" className="rounded-circle" alt="User" />
                                    <span className="ms-2 text-white">{user.name}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Notification Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{selectedNotification ? selectedNotification.title : "Notification"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedNotification ? (
                        <div className="d-flex flex-column">
                            <div className="p-3 bg-light rounded mb-3">
                                <p className="mb-2">
                                    {selectedNotification.message}
                                </p>
                                <p className="mb-0">
                                        Created At: {new Date(selectedNotification.created_at).toLocaleString('en-US', {
                                        timeZone: 'Asia/Manila',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',    
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                            <small className="text-muted text-center"> {getTimeAgo(selectedNotification.created_at)}</small>
                        </div>
                    ) : (
                        <p className="text-center text-muted">No details available</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavigationBar;
