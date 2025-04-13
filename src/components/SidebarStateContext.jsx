import React, { createContext, useContext, useState } from 'react';

const SidebarStateContext = createContext();

export const SidebarStateProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        // Toggle body class for mobile devices
        if (window.innerWidth <= 768) {
            document.body.classList.toggle('sidebar-open');
        }
    };
    const setSidebarOpen = (isOpen) => {
        setIsSidebarOpen(isOpen);
        if (window.innerWidth <= 768) {
            if (isOpen) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        }
    };
    return (
        <SidebarStateContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen  }}>
            {children}
        </SidebarStateContext.Provider>
    );
};

export const useSidebarState = () => {
    const context = useContext(SidebarStateContext);
    if (!context) {
        throw new Error('useSidebarState must be used within a SidebarStateProvider');
    }
    return context;
};
