import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Help icon
import axios from 'axios';
import { useAuth } from '../AuthContext';

const CreateModal = ({ show, handleClose, existingReport }) => {
    const { user } = useAuth();
    const [reportType, setReportType] = useState('maintenance');
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
    });
    const [loading, setLoading] = useState(false);

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
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image_path: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key] === true ? '1' : formData[key]);
        });

        try {
            const endpoint = reportType === 'lostfound' ?
                'http://localhost:5000/api/lostandfound/create-lost-found' :
                'http://localhost:5000/api/reports/create-report';

            const response = await axios.post(endpoint, formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Report submitted successfully!');
                handleClose();

                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting report');
        } finally {
            setLoading(false);
        }
    };

    // Tooltip for the help icon
    const renderTooltip = (props) => (
        <Tooltip id="help-tooltip" {...props} className='bg-white'>
            Select the report type and fill in the details.<br />
            - <b>Lost & Found:</b> Report lost or found items.<br />
            - <b>Maintenance:</b> Report building or facility issues.<br />
            - <b>Incident:</b> Report any incidents on campus.
        </Tooltip>
    );
    return (
        <Modal show={show} onHide={handleClose} centered size='lg'>
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
                            <option value="maintenance">Maintenance Report</option>
                            <option value="lostfound">Lost & Found</option>
                            <option value="incident">Incident Report</option>
                        </Form.Select>
                    </Form.Group>

                    {reportType === 'lostfound' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Select name="type" value={formData.type} onChange={handleInputChange}>
                                    <option value="lost">Lost</option>
                                    <option value="found">Found</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control type="text" name="item_name" value={formData.item_name} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
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
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contact Info</Form.Label>
                                <Form.Control type="text" name="contact_info" value={formData.contact_info} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" label="Post anonymously" name="is_anonymous" checked={formData.is_anonymous} onChange={handleInputChange} />
                            </Form.Group>
                        </>
                    )}

                    {reportType === 'maintenance' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Issue Type</Form.Label>
                            <Form.Select name="issue_type" value={formData.issue_type} onChange={handleInputChange}>
                                <option value="">Select issue type</option>
                                <option value="plumbing">Plumbing Issue</option>
                                <option value="electrical">Electrical Problem</option>
                                <option value="structural">Structural Damage</option>
                                <option value="cleaning">Cleaning Required</option>
                                <option value="safety">Safety Concern</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
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
export default CreateModal;
