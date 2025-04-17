import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext.jsx';
import MaintenanaceReports from './pages/Maintenance Reports/MaintenanaceReports.jsx';
import HomeScreen from './pages/Home.jsx';
import AdminDashboard from './pages/Maintenance Reports/AdminDashboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import AdminLostAndFound from './pages/LostAndFound/LostAndFound.jsx';
import { NavigationProvider } from './components/SidebarContext.jsx';
import { SidebarStateProvider } from './components/SidebarStateContext.jsx';
import Notifications from './pages/Notifications.jsx';
import LostAndFoundDashboard from './pages/LostAndFound/LostAndFoundDashboard.jsx';
import ReportScreen from './pages/Reports/ReportScreen.jsx';
import UserLostAndFound from './pages/Users Page/pages/UserLostAndFound.jsx';
import GuestScreen from './pages/GuestScreen.jsx';
import UserReports from './pages/Users Page/pages/UserReports.jsx';
import AdminMessages from './pages/Messages/Messages.jsx';
import IncidentReportScreen from './pages/Incident/IncidentReportsScreen.jsx';
import IncidentReportDashboard from './pages/Incident/IncidentReportDashboard.jsx';
import Events from './pages/Events/Events.jsx';
import UserManagement from './pages/Users Management/UserManagement.jsx';
import FloatingChat from './components/FloatingChat.jsx';
import { adminRoles } from './functions/AdminRoles.jsx';


function App() {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            {/* Check if the user is authenticated */}
            {isAuthenticated ? (
                // If authenticated, render the app
                <NavigationProvider>
                    <SidebarStateProvider>
                        <div className="d-flex">
                            <Sidebar />
                            <div className="main-content">
                                <NavigationBar />
                                {/* <FloatingChat/> */}
                                {/* {adminRoles.includes(role) && <FloatingChat />} */}
                                <Routes>
                                    {/* Check if the user is an admin */}
                                    {role === 'admin' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path="/users" element={<UserManagement />} />
                                            <Route path='/reports' element={<ReportScreen />} />
                                            <Route path="/maintenace-report-dashboard" element={<AdminDashboard />} />
                                            <Route path="/maintenance-reports" element={<MaintenanaceReports />} />
                                            <Route path="/lost-and-found-dashboard" element={<LostAndFoundDashboard />} />
                                            <Route path="/lost-and-found-reports" element={<AdminLostAndFound />} />
                                            <Route path='/incident-report-dashboard' element={<IncidentReportDashboard />} />
                                            <Route path="/incident-reports" element={<IncidentReportScreen />} />
                                            <Route path="/events" element={<Events />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'report-manager' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path='/reports' element={<ReportScreen />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'maintenance-report-manager' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path="/maintenace-report-dashboard" element={<AdminDashboard />} />
                                            <Route path="/maintenance-reports" element={<MaintenanaceReports />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'lost-and-found-manager' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path="/lost-and-found-dashboard" element={<LostAndFoundDashboard />} />
                                            <Route path="/lost-and-found-reports" element={<AdminLostAndFound />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'incident-report-manager' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path='/reports' element={<ReportScreen />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'user' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path="/list-screen" element={<UserLostAndFound />} />
                                            <Route path='/notifications' element={<Notifications />} />
                                            <Route path="/messages" element={<AdminMessages />} />
                                            <Route path="/reports-screen" element={<UserReports />} />
                                            <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                </Routes>
                            </div>
                        </div>
                    </SidebarStateProvider>
                </NavigationProvider>
            ) : (
                <Routes>
                    <Route path="/guest" element={<GuestScreen />} />
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            )}
        </Router>
    );
}
export default App;