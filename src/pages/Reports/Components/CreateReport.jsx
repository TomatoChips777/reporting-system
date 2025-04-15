import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger, Row, Col } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const CreateReport = ({ show, handleClose }) => {
    const { user } = useAuth();
    const [reportType, setReportType] = useState('Maintenance Report');
    const [formData, setFormData] = useState({
        user_id: user?.id,
        type: 'lost',
        item_name: '',
        category: '',
        description: '',
        location: '',
        contact_info: '',
        is_anonymous: false,
        image_path: null,
        issue_type: '',
        priority: '',
        assigned_staff: '',
        status: '',
        report_type: reportType,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, report_type: reportType }));
    }, [reportType]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image_path: e.target.files[0]
        }));
    };

    const resetForm = () => {
        setFormData({
            user_id: user?.id,
            type: 'lost',
            item_name: '',
            category: '',
            description: '',
            location: '',
            contact_info: '',
            is_anonymous: false,
            image_path: null,
            issue_type: '',
            priority: '',
            assigned_staff: '',
            status: '',
            report_type: reportType,

        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();

        // Ensure user_id and report_type are set correctly before building FormData
        const preparedData = {
            ...formData,
            user_id: user?.id,
            report_type: reportType
        };

        Object.entries(preparedData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formDataObj.append(key, value === true ? '1' : value);
            }
        });

        try {

            const response = await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Report submitted successfully!');
                handleClose();
                resetForm();
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting report');
        } finally {
            setLoading(false);
        }
    };



    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Fill in the report form and choose the appropriate type.
        </Tooltip>
    );

    return (
        <Modal show={show} onHide={handleClose} centered size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Create Report</Modal.Title>
                <OverlayTrigger placement="left" overlay={renderTooltip}>
                    <BsQuestionCircle className="ms-2 text-primary" size={20} style={{ cursor: 'pointer' }} />
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Report Type</Form.Label>
                        <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <option value="Maintenance Report">Maintenance Report</option>
                            <option value="Lost And Found">Lost & Found</option>
                            <option value="Incident Report">Incident Report</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control name="location" value={formData.location} onChange={handleInputChange} required />
                    </Form.Group>
                    {reportType === 'Lost And Found' && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select name="type" value={formData.type} onChange={handleInputChange}>
                                        <option value="lost">Lost</option>
                                        <option value="found">Found</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control name="item_name" value={formData.item_name} onChange={handleInputChange} required />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select name="category" value={formData.category} onChange={handleInputChange} required>
                                        <option value="">Select Category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="documents">Documents</option>
                                        <option value="keys">Keys</option>
                                        <option value="wallet">Wallet</option>
                                        <option value="bag">Bag</option>
                                        <option value="stationery">Stationery</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Contact Info</Form.Label>
                                    <Form.Control name="contact_info" value={formData.contact_info} onChange={handleInputChange} required />
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" label="Post anonymously" name="is_anonymous" checked={formData.is_anonymous} onChange={handleInputChange} />
                            </Form.Group>
                        </>
                    )}

                    {(reportType === 'Maintenance Report' || reportType === 'Incident Report') && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select name="category" value={formData.category} onChange={handleInputChange} required>
                                        <option value="">Select Category</option>
                                        {reportType === 'Maintenance Report' ? (
                                            <>
                                                <option value="Electrical">Electrical</option>
                                                <option value="Plumbing">Plumbing</option>
                                                <option value="Cleaning">Cleaning</option>
                                                <option value="General Repair">General Repair</option>
                                                <option value="Other">Other</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Theft">Theft</option>
                                                <option value="Vandalism">Vandalism</option>
                                                <option value="Harassment">Harassment</option>
                                                <option value="Bullying">Bullying</option>
                                                <option value="Verbal abuse">Verbal abuse</option>
                                                <option value="Fire incident">Fire incident</option>
                                                <option value="Medical emergency">Medical emergency</option>
                                                <option value="Cyberbullying">Cyberbullying</option>
                                                <option value="Property damage">Property damage</option>
                                                <option value="Trespassing">Trespassing</option>
                                                <option value="Accident/Injury">Accident/Injury</option>
                                                <option value="Other">Other</option>
                                            </>
                                        )}
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Select name="priority" value={formData.priority} onChange={handleInputChange} required>
                                        <option value="">Select Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </Form.Select>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Label>Assigned Staff</Form.Label>
                                    <Form.Control name="assigned_staff" value={formData.assigned_staff} onChange={handleInputChange} required />
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default CreateReport;
