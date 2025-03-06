import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Tools, Search, Clipboard } from 'react-bootstrap-icons';

function Dashboard() {
    const modules = [
        { name: "Maintenance Reports", icon: <Tools size={50} />, path: "/reports" },
        { name: "Lost and Found", icon: <Search size={50} />, path: "/lost-and-found" },
        { name: "Borrowing Items", icon: <Clipboard size={50} />, path: "/borrowing-items" }
    ];

    return (
        
        <Container fluid className="mt-4">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <Row className="justify-content-center">
                {modules.map((module, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Link to={module.path} style={{ textDecoration: 'none' }}>
                            <Card className="text-center shadow-sm p-3">
                                <Card.Body>
                                    <div className="mb-3">{module.icon}</div>
                                    <Card.Title>{module.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
        
    );
}
export default Dashboard;
