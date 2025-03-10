import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoDocumentText, IoPerson, IoSettings, IoClose } from 'react-icons/io5';
import { useAuth } from '../../AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role } = useAuth();
    const location = useLocation();

    return (
        <div className={` sidebar ${isOpen ? 'open' : ''}`}>
            <button className="btn btn-danger d-md-none m-2" onClick={toggleSidebar}>
                <IoClose size={24} />
            </button>
            <ul>
                {role === 'admin' && (
                    <>
                        <li className={location.pathname === "/Home" ? "active" : ""}>
                            <Link to="/home"><IoHome className="me-2" /> Home</Link>
                        </li>
                        <li className={location.pathname === "/dashboard" ? "active" : ""}>
                            <Link to="/dashboard"><IoDocumentText className="me-2" /> Dashboard</Link>
                        </li>
                        <li className={location.pathname === "/reports" ? "active" : ""}>
                            <Link to="/reports"><IoDocumentText className="me-2" /> Reports</Link>
                        </li>
                        <li className={location.pathname === "/users" ? "active" : ""}>
                            <Link to="/users"><IoPerson className="me-2" /> Users</Link>
                        </li>
                        <li className={location.pathname === "/settings" ? "active" : ""}>
                            <Link to="/settings"><IoSettings className="me-2" /> Settings</Link>
                        </li>
                    </>
                )}
                {role === 'student' && (
                    <>
                        <li className={location.pathname === "/dashboard" ? "active" : ""}>
                            <Link to="/dashboard"><IoHome className="me-2" /> Home</Link>
                        </li>
                        <li className={location.pathname === "/student-reports" ? "active" : ""}>
                            <Link to="/student-reports"><IoDocumentText className="me-2" /> Reports</Link>
                        </li>
                        <li className={location.pathname === "/lost-found" ? "active" : ""}>
                            <Link to="/lost-found"><IoDocumentText className="me-2" /> Lost & Found</Link>
                        </li>
                        <li className={location.pathname === "/incident-report" ? "active" : ""}>
                            <Link to="/incident-report"><IoDocumentText className="me-2" /> Incident Reporting</Link>
                        </li>
                        <li className={location.pathname === "/borrow-items" ? "active" : ""}>
                            <Link to="/borrow-items"><IoDocumentText className="me-2" /> Borrow Items</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
