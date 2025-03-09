import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Bell } from 'react-bootstrap-icons';
import Sidebar from './Sidebar';
function NavigationBar() {
    const { user, signOut, role } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation(); // Get current path

    // Dummy notifications
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New report submitted", time: "2 mins ago" },
        { id: 2, message: "User John Doe registered", time: "10 mins ago" },
        { id: 3, message: "System update scheduled", time: "1 hour ago" },
    ]);

    const markAllAsRead = () => {
        setNotifications([]);
    };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Navbar bg="success" variant="dark" expand="lg" sticky="top" >
            <Container fluid>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="me-auto">
                        {role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/Home" className={location.pathname === "/Home" ? "active" : ""}>HOME</Nav.Link>
                                <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>DASHBOARD</Nav.Link>
                                <Nav.Link as={Link} to="/reports" className={location.pathname === "/reports" ? "active" : ""}>REPORTS</Nav.Link>
                                <Nav.Link as={Link} to="/users" className={location.pathname === "/users" ? "active" : ""}>USER MANAGEMENT</Nav.Link>
                                <Nav.Link as={Link} to="/sample" className={location.pathname === "/sample" ? "active" : ""}>SAMPLE</Nav.Link>
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
                                <>
                                    {notifications.map((notif) => (
                                        <Dropdown.Item key={notif.id}>
                                            <div className="d-flex justify-content-between">
                                                <span>{notif.message}</span>
                                                <small className="text-muted">{notif.time}</small>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="text-center text-primary" onClick={markAllAsRead}>
                                        Mark All as Read
                                    </Dropdown.Item>
                                </>
                            ) : (
                                <Dropdown.Item className="text-center text-muted">No new notifications</Dropdown.Item>
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
    );
}

export default NavigationBar;
