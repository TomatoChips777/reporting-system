import { Navbar, Nav, Container, Dropdown, Badge, Modal, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Bell } from 'react-bootstrap-icons';
import Sidebar from './Sidebar';
import axios from 'axios';
import io from 'socket.io-client';

function NavigationBar() {
    const { user, signOut, role } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (role === "admin") {
                    const response = await axios.get("http://localhost:5000/api/reports/get-admin-notifcations");
                    setNotifications(response.data);
                } else {
                    const response = await axios.get(`http://localhost:5000/api/reports/get-notifcations/${user.id}`);
                    setNotifications(response.data);
                }

            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
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
                    const response = await axios.put(`http://localhost:5000/api/reports/admin/mark-notification-read/${notif.id}`);
                    if (response.success) {
                        fetchNotifications();
                    }
                } else {
                    const response = await axios.put(`http://localhost:5000/api/reports/user/mark-notification-read/${notif.id}`);
                    if (response.success) {
                        fetchNotifications();
                    }
                }
            } catch (error) {
                console.log("Error marking notification", error)
            }

            // axios.put(`http://localhost:5000/api/reports/mark-notification-read/${notif.id}`)
            //     .then(() => {
            //         fetchNotifications();
            //     })
            //     .catch((error) => console.error("Error marking notification as read:", error));
        }
    };
    const markAllAsRead = () => {
        setNotifications([]);
    };
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <Navbar bg="success" variant="dark" expand="lg" sticky="top" >
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarSupportedContent" />
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto">
                            {role === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/Home" className={location.pathname === "/Home" ? "active" : ""}>Home</Nav.Link>
                                    <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dahsboard</Nav.Link>
                                    <Nav.Link as={Link} to="/reports" className={location.pathname === "/reports" ? "active" : ""}>Reports</Nav.Link>
                                    <Nav.Link as={Link} to="/users" className={location.pathname === "/users" ? "active" : ""}>Use Management</Nav.Link>
                                    <Nav.Link as={Link} to="/sample" className={location.pathname === "/sample" ? "active" : ""}>Sample</Nav.Link>
                                </>
                            )}
                            {role === 'student' && (
                                <>
                                    <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Home</Nav.Link>
                                    <Nav.Link as={Link} to="/student-reports" className={location.pathname === "/student-reports" ? "active" : ""}>Reports</Nav.Link>
                                    <Nav.Link as={Link} to="/sample" className={location.pathname === "/sample" ? "active" : ""}>Lost & Found</Nav.Link>
                                    <Nav.Link as={Link} to="/sample" className={location.pathname === "/sample" ? "active" : ""}>Incident Reporting</Nav.Link>
                                    <Nav.Link as={Link} to="/sample" className={location.pathname === "/sample" ? "active" : ""}>Borrow Items</Nav.Link>
                                </>
                            )}
                            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                    <Modal.Title className="fw-bold">Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedNotification ? (
                        <div className="d-flex flex-column">
                            <div className="p-3 bg-light rounded mb-3">
                                <p className="mb-2">
                                    {selectedNotification.message}
                                </p>
                                <p className="mb-0">
                                        Created At:{new Date(selectedNotification.created_at).toLocaleString('en-US', {
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
