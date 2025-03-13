import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const CreateReportModal = ({ show, handleClose, existingReport, fetchReports, setReports }) => {
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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show && existingReport) {
            setFormData(existingReport);
            setReportType(existingReport.reportType);
        } else {
            resetForm();
        }
    }, [show, existingReport]);

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
            if (key === 'is_anonymous') {
                formDataObj.append(key, formData[key] ? '1' : '0');
            } else {
                formDataObj.append(key, formData[key]);
            }
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
                fetchReports();
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Report</Modal.Title>
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
                                <Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} required />
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
