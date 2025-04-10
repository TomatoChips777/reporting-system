import { Navbar, Nav, Container, Dropdown, Badge, Modal, Button, } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import { useSidebarState } from './SidebarStateContext';
import { Bell, List, ChatDots } from 'react-bootstrap-icons';
import axios from 'axios';
import io from 'socket.io-client';
import { BsPersonCircle } from 'react-icons/bs';
function NavigationBar() {
    const navigate = useNavigate();
    const { user, signOut, role } = useAuth();
    const { getCurrentSection, setSectionByPath, pathToSection } = useNavigation();
    const { toggleSidebar } = useSidebarState();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    useEffect(() => {
        if (location.pathname && pathToSection[location.pathname]) {
            setSectionByPath(location.pathname);
        }
        console.log(unreadMessages);
    }, [location.pathname, setSectionByPath, pathToSection]);

    const fetchUnreadMessages = async () => {
        const response = await axios.get(`http://localhost:5000/api/messages/get-messages/${user.id}`);
        if (response.data.success) {
            const { previews, totalUnreadCount } = getUnreadMessagePreviews(response.data.messages, user.id);
            setUnreadMessages(previews);
            setTotalUnreadCount(totalUnreadCount); 
        }
    };


    const fetchNotifications = async () => {
        try {
            const endpoint = role === "admin"
                ? `${import.meta.env.VITE_ADMIN_NOTIFICATION}`
                : `${import.meta.env.VITE_USER_NOTIFICATION}/${user.id}`;

            const response = await axios.get(endpoint);
            const unreadNotifications = response.data.filter(notification => notification.is_read === 0);
            setNotifications(unreadNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on("update", () => {
            fetchNotifications();
        });
        fetchUnreadMessages();
        socket.on('messageCount', ({ senderId, receiverId }) => {
            if (user.id === receiverId || user.id === senderId) {
                fetchUnreadMessages();
            }
        });
        
        return () => {
            socket.disconnect();
        };
    }, []);


    const getUnreadMessagePreviews = (conversations, currentUserId) => {
        let totalUnreadCount = 0;
        const previewsMap = new Map();

        conversations.forEach(convo => {
            // Get all unread messages for the current user in the conversation
            const unreadMessages = convo.messages.filter(msg =>
                msg.receiverId === currentUserId && msg.status !== 'read'
            );

            if (unreadMessages.length > 0) {
                // Update the total unread count
                totalUnreadCount += unreadMessages.length;

                // Get the latest message from the unread ones
                const latestMsg = unreadMessages.reduce((latest, msg) =>
                    new Date(msg.created_at) > new Date(latest.created_at) ? msg : latest
                );

                // Use a composite key of report_id + convo.id to uniquely identify each conversation
                const key = `${convo.report_id}-${convo.id}`;
                previewsMap.set(key, {
                    id: convo.id,
                    report_id: convo.report_id,
                    user: convo.user,
                    item_name: convo.item_name,
                    item_type: convo.item_type,
                    lastMessage: latestMsg.text || "(Image)",
                    time: latestMsg.created_at,
                    unreadCount: unreadMessages.length,
                });
            }
        });
        return { previews: Array.from(previewsMap.values()), totalUnreadCount };
    };

    const handleNotificationClick = async (notif) => {
        setSelectedNotification(notif);
        setShowModal(true);
        if (!notif.is_read) {
            try {
                if (role === "admin") {
                    const response = await axios.put(`${import.meta.env.VITE_ADMIN_READ_NOTIFICATION_API}/${notif.id}`);
                    if (response.success) {
                        fetchNotifications();
                    }
                } else {
                    const response = await axios.put(`${import.meta.env.VITE_USER_READ_NOTIFICATION_API}/${notif.id}`);
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
            <Navbar
                bg="dark"
                // style={{backgroundColor: '#141414'}}
                variant="dark" expand="lg" sticky="top">
                <Container fluid>
                    <Button
                        variant="outline-light"
                        className="me-2 d-flex align-items-center"
                        onClick={toggleSidebar}
                    >
                        <List size={24} />
                    </Button>
                    {/* <Navbar.Toggle aria-controls="navbarSupportedContent" /> */}

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



                        <Dropdown show={showMessagesDropdown} onToggle={setShowMessagesDropdown} className="me-3">
                            <Dropdown.Toggle as="div" className="position-relative text-white" style={{ cursor: 'pointer' }}>
                                <ChatDots size={24} />
                                {totalUnreadCount > 0 && (
                                    <Badge
                                        bg="danger"
                                        pill
                                        className="position-absolute top-0 start-100 translate-middle"
                                        style={{ fontSize: '0.65rem' }}
                                    >
                                        {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                                    </Badge>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                align="end"
                                style={{ minWidth: "280px", maxHeight: "350px", overflowY: "auto" }}
                            >
                                <Dropdown.Header>Unread Conversations</Dropdown.Header>
                                {unreadMessages.length > 0 ? (
                                    unreadMessages.map((convo) => (
                                        <Dropdown.Item
                                            key={`${convo.report_id}-${convo.id}`}
                                            onClick={() => {
                                                navigate('/messages', {
                                                    state: {
                                                        session_id: convo.id,
                                                        report_id: convo.report_id,
                                                    },
                                                });
                                                setShowMessagesDropdown(false);
                                            }}
                                            className="d-flex p-2"
                                        >
                                            <div className="me-2">
                                                {convo.user?.avatar ? (
                                                    <img
                                                        src={convo.user.avatar}
                                                        width="40"
                                                        height="40"
                                                        className="rounded-circle"
                                                        alt="User"
                                                    />
                                                ) : (
                                                    <BsPersonCircle size={40} className="text-secondary" />
                                                )}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between">
                                                    <strong className="text-truncate">{convo.user?.name || "Unknown"}</strong>
                                                    <small className="text-muted">{getTimeAgo(convo.time)}</small>
                                                </div>
                                                <small className="text-muted text-truncate d-block">
                                                    [{convo.item_type.charAt(0).toUpperCase() + convo.item_type.slice(1)} - {convo.item_name}]
                                                </small>
                                                <div className="text-truncate">
                                                    {convo.lastMessage.length > 35
                                                        ? `${convo.lastMessage.substring(0, 35)}...`
                                                        : convo.lastMessage}
                                                </div>
                                            </div>
                                            {convo.unreadCount > 0 && (
                                                <Badge bg="danger" pill className="ms-2 align-self-start">
                                                    {convo.unreadCount > 99 ? "99+" : convo.unreadCount}
                                                </Badge>
                                            )}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item className="text-center text-muted">No unread messages</Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => navigate('/messages')} className="text-center ">
                                    View All
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

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
                                    <Dropdown.Item as={Link} to="/messages">Profile</Dropdown.Item>
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
                                <p className="mb-2">{selectedNotification.message}</p>
                                <small className="text-muted">{getTimeAgo(selectedNotification.created_at)}</small>
                            </div>
                        </div>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavigationBar;
