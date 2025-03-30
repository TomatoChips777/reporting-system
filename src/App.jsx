import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext.jsx';
import MaintenanaceReports from './pages/Maintenance Reports/MaintenanaceReports.jsx';
import HomeScreen from './pages/Home.jsx';
import Sample from './pages/Maintenance Reports/Sample.jsx';
import AdminDashboard from './pages/Maintenance Reports/AdminDashboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import AdminLostAndFound from './pages/LostAndFound/LostAndFound.jsx';
import { NavigationProvider } from './components/SidebarContext.jsx';
import { SidebarStateProvider } from './components/SidebarStateContext.jsx';
import Notifications from './pages/Notifications.jsx';
import LostAndFoundDashboard from './pages/LostAndFound/LostAndFoundDashboard.jsx';
import ReportScreen from './pages/Reports/ReportScreen.jsx';
import ListScreen from './pages/Student/pages/ListScreen.jsx';
import Messages from './pages/Student/pages/Messages.jsx';
import GuestScreen from './pages/GuestScreen.jsx';
import Testing from './pages/Student/pages/Testing.jsx';
import AdminMessages from './pages/Messages/Messages.jsx';

function App() {
    const { isAuthenticated, isLoading, role } = useAuth();
    
    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            {isAuthenticated ? (
                <NavigationProvider>
                    <SidebarStateProvider>
                        <NavigationBar />
                        <div className="d-flex vh-100">
                            <Sidebar />
                            <div className="main-content">
                                <Routes>
                                    {role === 'admin' && (
                                        <>
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path='/reports' element={<ReportScreen />} />
                                            <Route path="/maintenace-report-dashboard" element={<AdminDashboard />} />
                                            <Route path="/maintenance-reports" element={<MaintenanaceReports />} />
                                            <Route path="/lost-and-found-dashboard" element={<LostAndFoundDashboard />} />
                                            <Route path="/lost-and-found-reports" element={<AdminLostAndFound />} />
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
                                         <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                     {role === 'maintenance-report-manager' && (
                                        <>
                                         <Route path="/home" element={<HomeScreen />} />
                                         <Route path='/reports' element={<ReportScreen />} />
                                         <Route path="/messages" element={<AdminMessages />} />
                                         <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                     {role === 'incident-report-manager' && (
                                        <>
                                         <Route path="/home" element={<HomeScreen />} />
                                         <Route path='/reports' element={<ReportScreen />} />
                                         <Route path="/messages" element={<AdminMessages />} />
                                         <Route path="*" element={<Navigate to="/home" replace />} />
                                        </>
                                    )}
                                    {role === 'student' && (
                                        <>
                                           <Route path="/home" element={<HomeScreen />} />
                                           {/* <Route path="/reports-screen" element={<ReportScreen />} /> */}
                                           <Route path="/list-screen" element={<ListScreen />} />
                                           <Route path='/notifications' element={<Notifications />} />
                                           {/* <Route path='/messages' element={<Messages />} /> */}
                                           <Route path="/messages" element={<AdminMessages />} />

                                           <Route path="/reports-screen" element={<Testing />} />


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