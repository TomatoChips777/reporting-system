// import React, { useState } from 'react';
// import { Card, Row, Col, Container, Button, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { IoSettings, IoSearch, IoWarning, IoList, IoAddCircle } from 'react-icons/io5';
// import { useAuth } from '../../AuthContext';
// import CreateReportModal from './Student/components/CreateReportModal';

// const HomeScreen = () => {
//     const { role } = useAuth();
//     const navigate = useNavigate();
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');

//     const handleCloseModal = () => {
//         setShowCreateModal(false);
//     };

//     const handleOpenCreateModal = () => {
//         setShowCreateModal(true);
//     };

//     // Sections for ADMIN users
//     const adminSections = [
//         {
//             key: 'reports',
//             title: 'Reports',
//             icon: <IoSettings size={40} />,
//             description: 'View and manage reports requests',
//             color: '#2ecc71',
//             path: '/reports'
//         },
//         {
//             key: 'lostFound',
//             title: 'Lost and Found Reports',
//             icon: <IoSearch size={40} />,
//             description: 'Manage lost and found reports',
//             color: '#3498db',
//             path: '/lost-and-found-reports'
//         },
//         {
//             key: 'maintenance',
//             title: 'Maintenance Reports',
//             icon: <IoSettings size={40} />,
//             description: 'View and manage maintenance reports',
//             color: '#2ecc71',
//             path: '/maintenance-reports'
//         },
//         {
//             key: 'incidentReporting',
//             title: 'Incident Reporting',
//             icon: <IoWarning size={40} />,
//             description: 'View and investigate incidents',
//             color: '#e74c3c',
//             path: '/incidents'
//         },
//         {
//             key: 'borrowing',
//             title: 'Borrowing Management',
//             icon: <IoList size={40} />,
//             description: 'Manage item borrowing requests',
//             color: '#9b59b6',
//             path: '/borrow-items'
//         }
//     ];

//     // Sections for STUDENT users
//     const studentSections = [
//         {
//             key: 'lostFound',
//             title: 'Lost and Found',
//             icon: <IoSearch size={40} />,
//             description: 'Report or search for lost items',
//             color: '#3498db',
//             path: '/list-screen'
//         },
//         {
//             key: 'maintenance',
//             title: 'Report Screen',
//             icon: <IoSettings size={40} />,
//             description: 'Submit and track report requests',
//             color: '#2ecc71',
//             path: '/reports-screen'
//         },
//         {
//             key: 'messages',
//             title: 'Messages',
//             icon: <IoList size={40} />,
//             description: 'View messages related to reports',
//             color: '#f39c12',
//             path: '/messages'
//         }
//     ];

//     const selectedSections = role === 'admin' ? adminSections : studentSections;

//     // Filtered sections based on search term
//     const filteredSections = selectedSections.filter(section =>
//         section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         section.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <Container className="py-0">
//             <h2 className="mb-4 text-center">Welcome! Select a Service</h2>
//             {/* Submit a Report Section */}
//             {role === 'student' && (

//                 <Row className="mb-4">
//                     <Col xs={12}>
//                         <Card
//                             className="shadow-lg text-center p-4"
//                             style={{ backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer' }}
//                             onClick={() => handleOpenCreateModal()}
//                         >
//                             <Card.Body>
//                                 <IoAddCircle size={50} />
//                                 <h3 className="mt-3">Submit a Report</h3>
//                                 <p>Report maintenance issues, lost items, or incidents.</p>
//                                 <Button variant="light" size="lg">Report Now</Button>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             )}
//             {/* Search Section */}
//             <Row className="mb-4">
//                 <Col xs={12}>
//                     <div className="input-group">
//                         <span className="input-group-text" id="basic-addon1">
//                             <IoSearch size={20} />
//                         </span>
//                         <Form.Control
//                             type="text"
//                             placeholder="Search services..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="shadow-sm rounded-0 fs-5"
//                             style={{ padding: '15px', fontSize: '16px' }}
//                         />
//                     </div>
//                 </Col>
//             </Row>
//             {/* Services Section */}
//             <Row className="g-4">
//                 {filteredSections.length > 0 ? (
//                     filteredSections.map((section) => (
//                         <Col key={section.key} xs={12} md={6} lg={3}>
//                             <Card
//                                 className="h-100 shadow-sm hover-card"
//                                 onClick={() => navigate(section.path)}
//                                 style={{ cursor: 'pointer' }}
//                             >
//                                 <Card.Body className="d-flex flex-column align-items-center text-center p-4">
//                                     <div
//                                         className="icon-circle mb-3"
//                                         style={{
//                                             backgroundColor: `${section.color}20`,
//                                             color: section.color,
//                                             padding: '20px',
//                                             borderRadius: '50%'
//                                         }}
//                                     >
//                                         {section.icon}
//                                     </div>
//                                     <Card.Title>{section.title}</Card.Title>
//                                     <Card.Text className="text-muted">
//                                         {section.description}
//                                     </Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))
//                 ) : (
//                     <Col xs={12}>
//                         <p className="text-center text-muted">No services found.</p>
//                     </Col>
//                 )}
//             </Row>

//             <CreateReportModal
//                 show={showCreateModal}
//                 handleClose={() => handleCloseModal()}
//                 fetchItems={null}
//                 existingItem={null}
//             />
//         </Container>
//     );
// };

// export default HomeScreen;



import React, { useState } from 'react';
import { Card, Row, Col, Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoSettings, IoSearch, IoWarning, IoList, IoAddCircle } from 'react-icons/io5';
import { useAuth } from '../../AuthContext';
import CreateReportModal from './Student/components/CreateReportModal';

const HomeScreen = () => {
    const { role } = useAuth(); // Get the user's role
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCloseModal = () => {
        setShowCreateModal(false);
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Sections for different roles
    const adminSections = [
        {
            key: 'reports',
            title: 'Reports',
            icon: <IoSettings size={40} />,
            description: 'View and manage reports requests',
            color: '#2ecc71',
            path: '/reports'
        },
        {
            key: 'lostFound',
            title: 'Lost and Found Reports',
            icon: <IoSearch size={40} />,
            description: 'Manage lost and found reports',
            color: '#3498db',
            path: '/lost-and-found-reports'
        },
        {
            key: 'maintenance',
            title: 'Maintenance Reports',
            icon: <IoSettings size={40} />,
            description: 'View and manage maintenance reports',
            color: '#2ecc71',
            path: '/maintenance-reports'
        },
        {
            key: 'incidentReporting',
            title: 'Incident Reporting',
            icon: <IoWarning size={40} />,
            description: 'View and investigate incidents',
            color: '#e74c3c',
            path: '/incidents'
        },
        {
            key: 'borrowing',
            title: 'Borrowing Management',
            icon: <IoList size={40} />,
            description: 'Manage item borrowing requests',
            color: '#9b59b6',
            path: '/borrow-items'
        },
        {
            key: 'messages',
            title: 'Messages',
            icon: <IoList size={40} />,
            description: 'View messages related to reports',
            color: '#f39c12',
            path: '/messages'
        }
    ];

    const reportManagerSections = [
        {
            key: 'reports',
            title: 'Reports',
            icon: <IoSettings size={40} />,
            description: 'View and manage reports requests',
            color: '#2ecc71',
            path: '/reports'
        },
        {
            key: 'messages',
            title: 'Messages',
            icon: <IoList size={40} />,
            description: 'View messages related to reports',
            color: '#f39c12',
            path: '/messages'
        }
    ];

    const maintenanceReportManagerSections = [
        {
            key: 'maintenance',
            title: 'Maintenance Reports',
            icon: <IoSettings size={40} />,
            description: 'View and manage maintenance reports',
            color: '#2ecc71',
            path: '/maintenance-reports'
        },
        {
            key: 'messages',
            title: 'Messages',
            icon: <IoList size={40} />,
            description: 'View messages related to reports',
            color: '#f39c12',
            path: '/messages'
        }
    ];

    const studentSections = [
        {
            key: 'lostFound',
            title: 'Lost and Found',
            icon: <IoSearch size={40} />,
            description: 'Report or search for lost items',
            color: '#3498db',
            path: '/list-screen'
        },
        {
            key: 'maintenance',
            title: 'Report Screen',
            icon: <IoSettings size={40} />,
            description: 'Submit and track report requests',
            color: '#2ecc71',
            path: '/reports-screen'
        },
        {
            key: 'messages',
            title: 'Messages',
            icon: <IoList size={40} />,
            description: 'View messages related to reports',
            color: '#f39c12',
            path: '/messages'
        }
    ];

    const incidentReportManagerSections = [
        {
            key: 'incidentReporting',
            title: 'Incident Reporting',
            icon: <IoWarning size={40} />,
            description: 'View and investigate incidents',
            color: '#e74c3c',
            path: '/incidents'
        },
        {
            key: 'messages',
            title: 'Messages',
            icon: <IoList size={40} />,
            description: 'View messages related to reports',
            color: '#f39c12',
            path: '/messages'
        }
    ];

    // Determine which sections to display based on role
    let selectedSections = [];
    switch (role) {
        case 'admin':
            selectedSections = adminSections;
            break;
        case 'report-manager':
            selectedSections = reportManagerSections;
            break;
        case 'maintenance-report-manager':
            selectedSections = maintenanceReportManagerSections;
            break;
        case 'incident-report-manager':
            selectedSections = incidentReportManagerSections;
            break;
        case 'student':
            selectedSections = studentSections;
            break;
        default:
            selectedSections = []; // In case of an unrecognized role
    }

    // Filtered sections based on search term
    const filteredSections = selectedSections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-0">
            {/* <h2 className="mb-4 text-center">Welcome! Select a Service</h2> */}

            {role === 'student' && (
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card
                            className="shadow-lg text-center p-4 bg-success"
                            style={{ backgroundColor: '', color: 'white', cursor: 'pointer' }}
                            onClick={handleOpenCreateModal}
                        >
                            <Card.Body>
                                <IoAddCircle size={50} />
                                <h3 className="mt-3">Submit a Report</h3>
                                <p>Report maintenance issues, lost items, or incidents.</p>
                                <Button variant="light" size="lg">Report Now</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Search Section */}
            <Row className="mb-4">
                <Col xs={12}>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <IoSearch size={20} />
                        </span>
                        <Form.Control
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shadow-sm rounded-0 fs-5"
                            style={{ padding: '15px', fontSize: '16px' }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Services Section */}
            <Row className="g-4">
                {filteredSections.length > 0 ? (
                    filteredSections.map((section) => (
                        <Col key={section.key} xs={12} md={6} lg={3}>
                            <Card
                                className="h-100 shadow-sm hover-card"
                                onClick={() => navigate(section.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                    <div
                                        className="icon-circle mb-3"
                                        style={{
                                            backgroundColor: `${section.color}20`,
                                            color: section.color,
                                            padding: '20px',
                                            borderRadius: '50%'
                                        }}
                                    >
                                        {section.icon}
                                    </div>
                                    <Card.Title>{section.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {section.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <p className="text-center text-muted">No services found.</p>
                    </Col>
                )}
            </Row>

            {/* Modal for submitting a report */}
            <CreateReportModal
                show={showCreateModal}
                handleClose={handleCloseModal}
                fetchItems={null}
                existingItem={null}
            />
        </Container>
    );
};

export default HomeScreen;
