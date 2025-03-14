import React, { Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoHome, IoDocumentText, IoPerson, IoSettings, IoClose } from 'react-icons/io5';
import { Bell } from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import axios from 'axios';
import io from 'socket.io-client';

class IconManager {
    static icons = {
        dashboard: <IoHome />,
        reports: <IoDocumentText />,
        maintenance: <IoSettings />,
        search: <IoPerson />,
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
                { key: 'maintenance', name: 'Maintenance Reporting', icon: <IoSettings /> },
                { key: 'lostFound', name: 'Lost & Found', icon: <IoPerson /> },
                { key: 'incidentReporting', name: 'Incident Reporting', icon: <IoDocumentText /> },
                { key: 'borrowing', name: 'Borrow Items', icon: <IoSettings /> }
            ];
        }
            return [
                { path: '/list-screen', name: 'Lost And Found', icon: <IoDocumentText /> },
                { path: '/reports-screen', name: 'My Reports', icon: <IoDocumentText /> }
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
        return this.props.notifications.length !== nextProps.notifications.length;
    }

    render() {
        const { notifications, location } = this.props;
        return (
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
        const { location, navigation, navigate, isOpen, toggleSidebar } = this.props;
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
                        {currentSection.routes.map((route, index) => (
                            <SidebarLink
                                key={index}
                                to={route.path}
                                icon={IconManager.getIcon(route.icon)}
                                isActive={location.pathname === route.path}
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
        const { isOpen, toggleSidebar, location } = this.props;
        return (
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="btn btn-danger d-md-none m-2" onClick={toggleSidebar}>
                    <IoClose size={24} />
                </button>
                <ul className="sidebar-list">
                    <div className="sidebar-content">
                        {this.renderSidebarContent()}
                    </div>
                    <NotificationBadge 
                        notifications={this.state.notifications} 
                        location={location}
                    />
                </ul>
            </div>
        );
    }
}

// HOC to wrap Sidebar with necessary context
const SidebarWrapper = (props) => {
    const auth = useAuth();
    const navigation = useNavigation();
    const location = useLocation();
    const navigate = useNavigate();
    
    return (
        <Sidebar
            {...props}
            auth={auth}
            navigation={navigation}
            location={location}
            navigate={navigate}
        />
    );
};

export default SidebarWrapper;
