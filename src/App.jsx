import React, {useState}from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../AuthContext.jsx';
import Reports from './pages/Maintenance Reports/Reports.jsx';
import HomeScreen from './pages/Maintenance Reports/Home.jsx';
import Sample from './pages/Maintenance Reports/Sample.jsx';
import StudentDashboard from './pages/Student/Maintenance Reports/Dashboard.jsx'; 
import StudentReports from './pages/Student/Maintenance Reports/Reports.jsx';
import StudentSample from './pages/Student/Maintenance Reports/Sample.jsx';
import AdminDashboard from './pages/Maintenance Reports/AdminDashboard.jsx';
import Sidebar from './components/Sidebar.jsx';
const Contact = () => <h1>Contact Page</h1>;

function App() {
    const { isAuthenticated, isLoading, role } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            {isAuthenticated ? (
                <>
                    <NavigationBar />
                    <div className="d-flex vh-100">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="main-content">
                            <Routes>
                                {role === 'admin' && (
                                    <>
                                        <Route path="/home" element={<HomeScreen />} />
                                        <Route path="/dashboard" element={<AdminDashboard />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/sample" element={<Sample />} />
                                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                    </>
                                )}
                                {role === 'student' && (
                                    <>
                                        <Route path="/dashboard" element={<StudentDashboard />} />
                                        <Route path="/student-reports" element={<StudentReports />} />
                                        <Route path="/sample" element={<StudentSample />} />
                                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                    </>
                                )}
                            </Routes>
                        </div>
                    </div>
                </>
            ) : (
                <Routes>
                    <Route path="*" element={<LoginScreen />} />
                </Routes>
            )}
        </Router>
    );
}

export default App;

// function App() {
//     const { isAuthenticated, isLoading, role } = useAuth();

//     if (isLoading) return <div>Loading...</div>;

//     return (
//         <Router>
//             {isAuthenticated ? (
//                 <>
//                     <NavigationBar />
//                     <Routes>
//                         {role === 'admin' && (
//                             <>
//                                 <Route path="/home" element={<HomeScreen />} />
//                                 <Route path="/dashboard" element={<AdminDashboard />} />
//                                 <Route path="/reports" element={<Reports />} />
//                                 <Route path="/sample" element={<Sample />} />
                                
//                                 <Route path="*" element={<Navigate to={role === 'admin' ? "/dashboard" : "/"} replace />} />

//                             </>
//                         )}
//                         {role === 'student' && (
//                             <>
//                                 <Route path="/dashboard" element={<StudentDashboard />} />
//                                 <Route path="/student-reports" element={<StudentReports />} />
//                                 <Route path="/sample" element={<StudentSample />} />
//                                 <Route path="*" element={<Navigate to={role === 'student' ? "/dashboard" : "/"} replace />} />

//                             </>
//                         )}
//                     </Routes>
//                 </>
//             ) : (
//                 <Routes>
//                     <Route path="*" element={<LoginScreen />} />
//                 </Routes>
//             )}
//         </Router>
//     );
// }

// export default App;
// //     return (
// //         <Router>
// //             {isAuthenticated ? (
// //                 <>
// //                     <Navbar />
// //                     <Routes>
// //                         <Route path="/" element={<Home />} />
// //                         <Route path="/reports" element={<Reports />} />
// //                         <Route path="/contact" element={<Contact />} />
// //                         <Route path="*" element={<Navigate to="/" replace />} />
// //                     </Routes>
// //                 </>
// //             ) : (
// //                 <Routes>
// //                     <Route path="*" element={<LoginScreen />} />
// //                 </Routes>
// //             )}
// //         </Router>
// //     );
// // }

// // export default App;
