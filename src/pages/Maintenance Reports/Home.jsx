import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoSettings, IoSearch, IoWarning, IoList } from 'react-icons/io5';
import { useNavigation } from '../../components/SidebarContext';

const HomeScreen = () => {
    const navigate = useNavigate();
    const { setSection } = useNavigation();

    const sections = [
        {
            key: 'maintenance',
            title: 'Maintenance Reporting',
            icon: <IoSettings size={40} />,
            description: 'Submit and track maintenance requests',
            color: '#2ecc71'
        },
        {
            key: 'lostFound',
            title: 'Lost and Found',
            icon: <IoSearch size={40} />,
            description: 'Report or search for lost items',
            color: '#3498db'
        },
        {
            key: 'incidentReporting',
            title: 'Incident Reporting',
            icon: <IoWarning size={40} />,
            description: 'Report security incidents or concerns',
            color: '#e74c3c'
        },
        {
            key: 'borrowing',
            title: 'Borrow Items',
            icon: <IoList size={40} />,
            description: 'Browse and borrow available items',
            color: '#9b59b6'
        }
    ];

    const handleSectionSelect = (sectionKey) => {
        setSection(sectionKey);
        switch (sectionKey) {
            case 'maintenance':
                navigate('/dashboard');
                break;
            case 'lostFound':
                navigate('/lost-and-found');
                break;
            case 'incidentReporting':
                navigate('/incidents');
                break;
            case 'borrowing':
                navigate('/borrow-items');
                break;
            default:
                navigate('/home');
        }
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">Welcome! Select a Service</h2>
            <Row className="g-4">
                {sections.map((section) => (
                    <Col key={section.key} xs={12} md={6} lg={3}>
                        <Card 
                            className="h-100 shadow-sm hover-card" 
                            onClick={() => handleSectionSelect(section.key)}
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
        </Container>
    );
};

export default HomeScreen;