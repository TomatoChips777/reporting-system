import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState(() => {
        const saved = localStorage.getItem('activeSection');
        return saved || 'home';
    });

    const sections = {
        home: {
            name: 'Home',
            routes: []  // Empty for home as it shows selection options
        },
        maintenance: {
            name: 'Maintenance Reporting',
            defaultPath: '/dashboard',
            routes: [
                { path: '/dashboard', name: 'Dashboard', icon: 'dashboard' },
                { path: '/reports', name: 'Reports', icon: 'reports' },
                { path: '/maintenance-requests', name: 'Maintenance Requests', icon: 'maintenance' }
            ]
        },
        lostFound: {
            name: 'Lost and Found',
            defaultPath: '/lost-and-found',
            routes: [
                { path: '/lost-and-found', name: 'Lost & Found', icon: 'search' },
                { path: '/my-reports', name: 'My Reports', icon: 'reports' }
            ]
        },
        incidentReporting: {
            name: 'Incident Reporting',
            defaultPath: '/incidents',
            routes: [
                { path: '/incidents', name: 'Incidents', icon: 'warning' },
                { path: '/report-incident', name: 'Report Incident', icon: 'create' }
            ]
        },
        borrowing: {
            name: 'Borrow Items',
            defaultPath: '/borrow-items',
            routes: [
                { path: '/borrow-items', name: 'Available Items', icon: 'inventory' },
                { path: '/my-borrowed', name: 'My Borrowed Items', icon: 'list' }
            ]
        }
    };

    // Map paths to section keys
    const pathToSection = {
        '/maintenance': 'maintenance',
        '/dashboard': 'maintenance',
        '/reports': 'maintenance',
        '/maintenance-requests': 'maintenance',
        
        '/lost-and-found': 'lostFound',
        '/my-reports': 'lostFound',
        
        '/incidents': 'incidentReporting',
        '/report-incident': 'incidentReporting',
        
        '/borrow-items': 'borrowing',
        '/my-borrowed': 'borrowing',
        
        '/home': 'home'
    };

    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    const setSection = (sectionKey) => {
        if (sections[sectionKey]) {
            setActiveSection(sectionKey);
        }
    };

    const setSectionByPath = (path) => {
        const sectionKey = pathToSection[path];
        if (sectionKey) {
            setActiveSection(sectionKey);
        }
    };

    const getCurrentSection = () => {
        return sections[activeSection] || sections.home;
    };

    const getAvailableSections = () => {
        return Object.keys(sections).map(key => ({
            key,
            name: sections[key].name,
            defaultPath: sections[key].defaultPath || '/home'
        }));
    };

    const contextValue = {
        activeSection,
        setSection,
        setSectionByPath,
        getCurrentSection,
        getAvailableSections,
        sections,
        pathToSection
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