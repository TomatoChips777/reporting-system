import React, { Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoHome, IoDocumentText, IoPerson, IoSettings, IoSearch,IoInformationCircle  } from 'react-icons/io5';
import { Bell } from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import { useSidebarState } from './SidebarStateContext';
import axios from 'axios';
import io from 'socket.io-client';

class IconManager {
    static icons = {
        dashboard: <IoHome />,
        reports: <IoDocumentText />,
        maintenance: <IoSettings />,
        search: <IoSearch />,
        warning: <IoDocumentText />,
        create: <IoDocumentText />,
        inventory: <IoSettings />,
        list: <IoDocumentText />,
        default: <IoHome />
    };

    static getIcon(iconName) {
        return this.icons[iconName] || this.icons.default;
    }
}

class NotificationManager {
    constructor(role, userId) {
        this.role = role;
        this.userId = userId;
        this.socket = null;
    }

    async fetchNotifications() {
        try {
            const endpoint = `http://localhost:5000/api/notifications/${this.role === "admin" ? "get-admin-notifications" : `get-notifications/${this.userId}`}`;
            const response = await axios.get(endpoint);
            return response.data.filter(notification => !notification.is_read);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    }

    initializeSocket(onUpdate) {
        this.socket = io("http://localhost:5000");
        this.socket.on("update", onUpdate);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

class SidebarManager {
    constructor(role, sections) {
        this.role = role;
        this.sections = sections;
    }

    getSectionLinks() {
        if (this.role === 'admin') {
            return [
                { key: 'reports', name: 'Reports', icon: <IoInformationCircle /> },
                { key: 'maintenance', name: 'Maintenance Reporting', icon: <IoSettings /> },
                { key: 'lostFound', name: 'Lost & Found', icon: <IoSearch /> },
                { key: 'incidentReporting', name: 'Incident Reporting', icon: <IoDocumentText /> },
                { key: 'borrowing', name: 'Borrow Items', icon: <IoSettings /> },
                { key: 'admin_messages', name: 'Messages', icon: <IoDocumentText /> }

            ];
        }
        return [
            { path: '/list-screen', name: 'Lost And Found', icon: <IoSearch /> },
            { path: '/reports-screen', name: 'Reports', icon: <IoDocumentText /> },
            { path: '/messages', name: 'Messages', icon: <IoDocumentText /> }

        ];
    }

    handleSectionClick(sectionKey, navigate, toggleSidebar) {
        const section = this.sections[sectionKey];
        if (section) {
            navigate(section.defaultPath);
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
            return true;
        }
        return false;
    }
}

class SidebarLink extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.isActive !== nextProps.isActive || 
               this.props.children !== nextProps.children;
    }

    render() {
        const { to, icon, children, isActive, onClick } = this.props;
        return (
            <li className={isActive ? "active" : ""}>
                <Link to={to} onClick={onClick}>
                    {icon}
                    <span className="ms-2">{children}</span>
                </Link>
            </li>
        );
    }
}

class NotificationBadge extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.notifications.length !== nextProps.notifications.length ||
               this.props.location.pathname !== nextProps.location.pathname;
    }

    render() {
        const { notifications, location, toggleSidebar } = this.props;
        const isActive = location.pathname === "/notifications";
        
        return (
            <div className="notification-container">
                <div className="sidebar-divider"></div>
                <li className={`notification-link ${isActive ? 'active' : ''}`}>
                    <Link 
                        to="/notifications" 
                        className={isActive ? "active" : ""}
                        onClick={() => {
                            if (window.innerWidth <= 768) {
                                toggleSidebar();
                            }
                        }}
                    >
                        <Bell className="me-2" />
                        Notifications
                        {notifications.length > 0 && (
                            <Badge bg="danger" className="ms-2">
                                {notifications.length}
                            </Badge>
                        )}
                    </Link>
                </li>
            </div>
        );
    }
}

class Sidebar extends Component {
    constructor(props) {
        super(props);
        const { role, user } = props.auth;
        this.state = {
            notifications: []
        };
        this.notificationManager = new NotificationManager(role, user.id);
        this.sidebarManager = new SidebarManager(role, props.navigation.sections);
    }

    componentDidMount() {
        this.fetchNotifications();
        this.notificationManager.initializeSocket(() => this.fetchNotifications());
    }

    componentWillUnmount() {
        this.notificationManager.disconnect();
    }

    async fetchNotifications() {
        const notifications = await this.notificationManager.fetchNotifications();
        this.setState({ notifications });
    }

    renderSidebarContent() {
        const { location, navigation, navigate, toggleSidebar } = this.props;
        const { activeSection, getCurrentSection } = navigation;
        const isHome = activeSection === 'home' || !activeSection;
        const currentSection = getCurrentSection();

        return (
            <>
                <SidebarLink 
                    to="/home" 
                    icon={<IoHome className="me-2" />}
                    isActive={location.pathname === "/home"}
                    onClick={() => isHome ? null : this.sidebarManager.handleSectionClick('home', navigate, toggleSidebar)}
                >
                    Home
                </SidebarLink>

                {isHome ? (
                    <>
                        <li className="section-header">Select a Section:</li>
                        {this.sidebarManager.getSectionLinks().map(link => (
                            <li key={link.key || link.path}>
                                {link.key ? (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        this.sidebarManager.handleSectionClick(link.key, navigate, toggleSidebar);
                                    }}>
                                        {link.icon}
                                        <span className="ms-2">{link.name}</span>
                                    </a>
                                ) : (
                                    <Link to={link.path} className={location.pathname === link.path ? "active" : ""}>
                                        {link.icon}
                                        <span className="ms-2">{link.name}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </>
                ) : (
                    <>
                        <li className="section-header">{currentSection.name}</li>
                        {currentSection.routes.map(route => (
                            <SidebarLink
                                key={route.path}
                                to={route.path}
                                icon={IconManager.getIcon(route.icon)}
                                isActive={location.pathname === route.path}
                                onClick={() => {
                                    if (window.innerWidth <= 768) {
                                        toggleSidebar();
                                    }
                                }}
                            >
                                {route.name}
                            </SidebarLink>
                        ))}
                    </>
                )}
            </>
        );
    }

    render() {
        const { isSidebarOpen, location, toggleSidebar } = this.props;
        return (
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ul className="sidebar-list">
                    {this.renderSidebarContent()}
                </ul>
                <NotificationBadge 
                    notifications={this.state.notifications} 
                    location={location}
                    toggleSidebar={toggleSidebar}
                />
            </div>
        );
    }
}

function SidebarWrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const navigation = useNavigation();
    const { isSidebarOpen, toggleSidebar } = useSidebarState();

    return (
        <Sidebar
            location={location}
            navigate={navigate}
            auth={auth}
            navigation={navigation}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
        />
    );
}

export default SidebarWrapper;
