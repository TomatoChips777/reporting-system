import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const CreateReport = ({ show, handleClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        user_id: user?.id,
        category: '',
        description: '',
        location: '',
        priority: '',
        assigned_staff: '',
        status: '',
        image_path: null,
        report_type: 'Incident Report',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            category: '',
            description: '',
            location: '',
            priority: '',
            assigned_staff: '',
            status: '',
            image_path: null,
            report_type: 'Maintenance Report',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();

        Object.entries({ ...formData, user_id: user?.id }).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formDataObj.append(key, value);
            }
        });

        try {
            const response = await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Incident report submitted successfully!');
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
            Fill in all maintenance-related details and submit.
        </Tooltip>
    );

    return (
        <Modal show={show} onHide={handleClose} centered size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>Create Maintenance Report</Modal.Title>
                <OverlayTrigger placement="left" overlay={renderTooltip}>
                    <BsQuestionCircle className="ms-2 text-primary" size={20} style={{ cursor: 'pointer' }} />
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" value={formData.location} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleInputChange} required>
                                <option value="">Select Category</option>
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
                            </Form.Select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name="priority" value={formData.priority} onChange={handleInputChange} required>
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </Form.Select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Label>Assigned Staff</Form.Label>
                            <Form.Control name="assigned_staff" value={formData.assigned_staff} onChange={handleInputChange} required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </Form.Select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={4} required />
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
