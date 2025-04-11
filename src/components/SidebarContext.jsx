import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';

class Section {
    constructor(name, defaultPath, routes = [], adminOnly = false) {
        this.name = name;
        this.defaultPath = defaultPath;
        this.routes = routes;
        this.adminOnly = adminOnly;
    }

    getFilteredRoutes(role) {
        return this.routes.filter(route => !route.adminOnly || role === 'admin' || role == 'report-manager' || role == 'maintenance-report-manager' || role == 'incident-report-manager');
    }

    hasAccess(role) {
        return !this.adminOnly || role === 'admin' || role == 'report-manager' || role == 'maintenance-report-manager' || role == 'incident-report-manager';
    }
}

class NavigationManager {
    constructor(role) {
        this.role = role;
        this.sections = this.initializeSections();
        this.pathToSection = this.buildPathMapping();
    }

    initializeSections() {
        return {
            home: new Section('Home', '/home', []),

            users: new Section('Users', '/users', [
                { path: '/users', name: 'Users', icon: 'users' },
                { path: '/user-requests', name: 'User Requests', icon: 'user-requests' }
            ]),
            reports: new Section('Reports', '/reports', [
                // { path: '/dashboard', name: 'Dashboard', icon: 'dashboard', adminOnly: true },
                { path: '/reports', name: 'Reports', icon: 'reports' },
                
            ]),
            maintenance: new Section('Maintenance Reporting', '/maintenace-report-dashboard', [
                { path: '/maintenace-report-dashboard', name: 'Dashboard', icon: 'dashboard', adminOnly: true },
                { path: '/maintenance-reports', name: 'Maintenance Reports', icon: 'maintenance' }
                
            ]),
        //    admin_messages: new Section('Messages', '/admin-messages', [
        //         { path: '/admin-messages', name: 'Messages', icon: 'reports', adminOnly: true },
        //     ]),
            lostFound: new Section('Lost and Found', '/lost-and-found-dashboard', [
                { path: '/lost-and-found-dashboard', name: 'Dashboard', icon: 'dashboard', adminOnly: true },
                { path: '/lost-and-found-reports', name: 'Lost And Found', icon: 'search' },
            ]),
            incident: new Section('Incident Reporting', '/incident-report-dashboard', [
                { path: '/incident-report-dashboard', name: 'Dashboard', icon: 'dashboard', adminOnly: true },
                { path: '/incident-reports', name: 'Incident Reports', icon: 'incident' }
            ]),
            borrowing: new Section('Borrow Items', '/borrow-items', [
                { path: '/borrow-items', name: 'Available Items', icon: 'inventory' },
                { path: '/my-borrowed', name: 'My Borrowed Items', icon: 'list' }
            ]),
            events: new Section('Events', '/events', [
                { path: '/events', name: 'Events', icon: 'calendar' },
            ]),
            student: new Section('Student Page', '/list-screen', [
                { path: '/list-screen', name: 'Lost And Found', icon: 'search' },
                { path: '/reports-screen', name: 'Reports', icon: 'reports' },
                // { path: '/messages', name: 'Messages', icon: 'reports' },

            ])
        };
    }

    buildPathMapping() {
        const mapping = { '/home': 'home' };
        Object.entries(this.sections).forEach(([key, section]) => {
            section.routes.forEach(route => {
                mapping[route.path] = key;
            });
        });
        return mapping;
    }

    getSection(sectionKey) {
        return this.sections[sectionKey] || this.sections.home;
    }

    getSectionByPath(path) {
        return this.sections[this.pathToSection[path]] || this.sections.home;
    }

    getAvailableSections() {
        return Object.entries(this.sections)
            .filter(([_, section]) => section.hasAccess(this.role))
            .map(([key, section]) => ({
                key,
                name: section.name,
                defaultPath: section.defaultPath
            }));
    }
}

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const { role } = useAuth();
    const [activeSection, setActiveSection] = useState(() => {
        const saved = localStorage.getItem('activeSection');
        return saved || 'home';
    });

    const navigationManager = new NavigationManager(role);

    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    const setSection = (sectionKey) => {
        if (navigationManager.sections[sectionKey]) {
            setActiveSection(sectionKey);
        }
    };

    const setSectionByPath = (path) => {
        const sectionKey = navigationManager.pathToSection[path];
        if (sectionKey) {
            setActiveSection(sectionKey);
        }
    };

    const getCurrentSection = () => {
        const section = navigationManager.getSection(activeSection);
        return {
            ...section,
            routes: section.getFilteredRoutes(role)
        };
    };

    const contextValue = {
        activeSection,
        setSection,
        setSectionByPath,
        getCurrentSection,
        getAvailableSections: () => navigationManager.getAvailableSections(),
        sections: navigationManager.sections,
        pathToSection: navigationManager.pathToSection
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};