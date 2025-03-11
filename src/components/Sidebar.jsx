import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoHome, IoDocumentText, IoPerson, IoSettings, IoClose } from 'react-icons/io5';
import { Bell } from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import axios from 'axios';
import io from 'socket.io-client';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { getCurrentSection, activeSection, setSectionByPath, sections } = useNavigation();
    const [notifications, setNotifications] = useState([]);

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

    const handleSectionClick = (sectionKey) => {
        const section = sections[sectionKey];
        if (section) {
            setSectionByPath(section.defaultPath);
            navigate(section.defaultPath);
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        }
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'dashboard': return <IoHome />;
            case 'reports': return <IoDocumentText />;
            case 'maintenance': return <IoSettings />;
            case 'search': return <IoPerson />;
            case 'warning': return <IoDocumentText />;
            case 'create': return <IoDocumentText />;
            case 'inventory': return <IoSettings />;
            case 'list': return <IoDocumentText />;
            default: return <IoHome />;
        }
    };

    const NotificationLink = () => (
        <li className="notification-link">
            <div className="sidebar-divider"></div>
            <Link to="/notifications" className={location.pathname === "/notifications" ? "active" : ""}>
                <Bell className="me-2" />
                Notifications
                {notifications.length > 0 && (
                    <Badge bg="danger" className="ms-2">
                        {notifications.length}
                    </Badge>
                )}
            </Link>
        </li>
    );

    // If we're on the home page or no section is selected, show section selection
    if (activeSection === 'home' || !activeSection) {
        return (
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="btn btn-danger d-md-none m-2" onClick={toggleSidebar}>
                    <IoClose size={24} />
                </button>
                <ul className="sidebar-list">
                    <div className="sidebar-content">
                        <li className={location.pathname === "/home" ? "active" : ""}>
                            <Link to="/home">
                                <IoHome className="me-2" /> Home
                            </Link>
                        </li>
                        <li className="section-header">Select a Section:</li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSectionClick('maintenance'); }}>
                                <IoSettings className="me-2" /> Maintenance Reporting
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSectionClick('lostFound'); }}>
                                <IoPerson className="me-2" /> Lost & Found
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSectionClick('incidentReporting'); }}>
                                <IoDocumentText className="me-2" /> Incident Reporting
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSectionClick('borrowing'); }}>
                                <IoSettings className="me-2" /> Borrow Items
                            </a>
                        </li>
                    </div>
                    <NotificationLink />
                </ul>
            </div>
        );
    }

    // Show section-specific navigation
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="btn btn-danger d-md-none m-2" onClick={toggleSidebar}>
                <IoClose size={24} />
            </button>
            <ul className="sidebar-list">
                <div className="sidebar-content">
                    <li className={location.pathname === "/home" ? "active" : ""}>
                        <Link to="/home" onClick={() => handleSectionClick('home')}>
                            <IoHome className="me-2" /> Home
                        </Link>
                    </li>
                    <li className="section-header">{getCurrentSection().name}</li>
                    {getCurrentSection().routes.map((route, index) => (
                        <li key={index} className={location.pathname === route.path ? "active" : ""}>
                            <Link to={route.path}>
                                {getIcon(route.icon)} 
                                <span className="ms-2">{route.name}</span>
                            </Link>
                        </li>
                    ))}
                </div>
                <NotificationLink />
            </ul>
        </div>
    );
};

export default Sidebar;
