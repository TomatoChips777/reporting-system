import React from 'react';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoSettings, IoSearch, IoWarning, IoList, IoAddCircle } from 'react-icons/io5';
import { useAuth } from '../../AuthContext';
import CreateReportModal from './Student/components/CreateReportModal';
import { useState } from 'react';
const HomeScreen = () => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCloseModal = () => {
        setShowCreateModal(false);
    };


    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };
    // Sections for ADMIN users
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
        }
    ];

    // Sections for STUDENT users
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

    const selectedSections = role === 'admin' ? adminSections : studentSections;

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Welcome! Select a Service</h2>
            
            {/* Submit a Report Section */}
            {role === 'student' && (
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card 
                            className="shadow-lg text-center p-4"
                            style={{ backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer' }}
                            onClick={() => handleOpenCreateModal()}
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

            {/* Services Section */}
            <Row className="g-4">
                {selectedSections.map((section) => (
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
                ))}
            </Row>

            <CreateReportModal
                show={showCreateModal}
                handleClose={() => handleCloseModal()}
                fetchItems={null}
                existingItem={null}
            />
        </Container>
    );
};

export default HomeScreen;
