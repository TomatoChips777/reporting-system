import React, { Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoHome, IoDocumentText, IoPerson, IoSettings, IoSearch, IoChatbubbleEllipses, IoSpeedometer, IoConstruct, IoAlbums, IoWarning, IoCalendar } from 'react-icons/io5';
import { Bell } from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigation } from './SidebarContext';
import { useSidebarState } from './SidebarStateContext';
import axios from 'axios';
import io from 'socket.io-client';
import { adminRoles } from '../functions/AdminRoles';

class IconManager {
    static icons = {
        dashboard: <IoSpeedometer />,
        reports: <IoAlbums />,
        maintenance: <IoConstruct />,
        search: <IoSearch />,
        warning: <IoDocumentText />,
        create: <IoDocumentText />,
        inventory: <IoSettings />,
        list: <IoDocumentText />,
        incident: <IoWarning />,
        calendar: <IoCalendar />,
        users:<IoPerson />,
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
            const endpoint = adminRoles.includes(this.role)
                ? `${import.meta.env.VITE_ADMIN_NOTIFICATION}`
                : `${import.meta.env.VITE_USER_NOTIFICATION}/${this.userId}`;
            const response = await axios.get(endpoint);
            let fetchedNotifications = response.data;

            if (this.role === "report-manager") {
                fetchedNotifications = fetchedNotifications.filter(n => n.title === "Reports");
            } else if (this.role === "maintenance-report-manager") {
                fetchedNotifications = fetchedNotifications.filter(n => n.title === "Maintenance Report");
            } else if (this.role === "lost-and-found-manager") {
                fetchedNotifications = fetchedNotifications.filter(n => n.title === "Lost And Found");
            }else if (this.role === "incident-report-manager") {
                fetchedNotifications = fetchedNotifications.filter(n => n.title === "Incident Report");
            }
            return fetchedNotifications.filter(notification => !notification.is_read);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    }

    initializeSocket(onUpdate, fetchUnreadMessages) {
        this.socket = io(`${import.meta.env.VITE_API_URL}`);

        this.socket.on("update", onUpdate);

        this.socket.on('messageCount', async ({ senderId, receiverId }) => {
            if (this.userId === receiverId || this.userId === senderId) {
                try {
                    const unreadMessages = await fetchUnreadMessages();
                    onUpdate(unreadMessages);
                } catch (error) {
                    console.error("Error updating unread messages:", error);
                }
            }
        });
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
                {key: 'users', name: 'User Management', icon: <IoPerson />},
                { key: 'reports', name: 'Reports', icon: <IoAlbums /> },
                { key: 'maintenance', name: 'Maintenance Reporting', icon: <IoConstruct /> },
                { key: 'lostFound', name: 'Lost & Found', icon: <IoSearch /> },
                { key: 'incident', name: 'Incident Reporting', icon: <IoWarning /> },
                // { key: 'borrowing', name: 'Borrow Items', icon: <IoSettings /> },
                // { key: 'events', name: 'Events', icon: <IoCalendar /> },


            ];
        } else if (this.role == 'report-manager') {
            return [
                { key: 'reports', name: 'Reports', icon: <IoDocumentText /> },

            ];
        }
        else if (this.role == 'maintenance-report-manager') {
            return [
                { key: 'maintenance', name: 'Maintenance Reports', icon: <IoConstruct /> },

            ];
        }
        else if (this.role == 'lost-and-found-manager') {
            return [
                { key: 'lostFound', name: 'Lost & Found', icon: <IoSearch /> },

            ];
        }
        else if (this.role == 'incident-report-manager') {
            return [
                { key: 'incidentReporting', name: 'Reports', icon: <IoWarning /> },

            ];
        }
        else {
            return [
                { path: '/list-screen', name: 'Lost And Found', icon: <IoSearch /> },
                { path: '/reports-screen', name: 'Reports', icon: <IoAlbums /> },
            ];
        }
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
            notifications: [],
            unreadMessages: 0 // Track unread messages
        };
        this.notificationManager = new NotificationManager(role, user.id);
        this.sidebarManager = new SidebarManager(role, props.navigation.sections);
    }

    componentDidMount() {
        this.fetchNotifications();
        this.fetchUnreadMessages(); // Fetch unread messages initially

        // Pass fetchUnreadMessages as an argument
        this.notificationManager.initializeSocket(
            () => this.fetchNotifications(),
            () => this.fetchUnreadMessages()
        );
    }

    componentWillUnmount() {
        this.notificationManager.disconnect();
    }
    async fetchUnreadMessages() {
        try {
            const { auth } = this.props;
            const response = await axios.get(`${import.meta.env.VITE_GET_MESSAGES}/${auth.user.id}`);
            if (response.data.success) {
                const unreadCount = response.data.messages.reduce((count, convo) =>
                    count + convo.messages.filter(msg => msg.status !== 'read' && msg.receiverId === auth.user.id).length
                    , 0);
                this.setState({ unreadMessages: unreadCount });
            }
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
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
                <SidebarLink
                    to="/messages"
                    icon={<IoChatbubbleEllipses />}
                    isActive={location.pathname === "/messages"}
                    onClick={() => {
                        if (window.innerWidth <= 768) {
                            toggleSidebar();
                        }
                    }}
                >
                    Messages
                    {this.state.unreadMessages > 0 && (
                        <Badge bg="danger" className="ms-2">
                            {this.state.unreadMessages > 99 ? "99+" : this.state.unreadMessages}
                        </Badge>
                    )}
                </SidebarLink>

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
