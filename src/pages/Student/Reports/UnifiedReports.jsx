import { useState, useEffect } from 'react';
import { useAuth } from '../../../../AuthContext';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreateReportModal = ({ show, handleClose, fetchReports }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: new Date().toISOString().slice(0, 16), // Current date-time
        image: null,
        priority: 'low'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            resetForm();
        }
    }, [show]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            date: new Date().toISOString().slice(0, 16),
            image: null,
            priority: 'low'
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({
                ...prev,
                image: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.date) newErrors.date = 'Date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const categorizeReport = (data) => {
        // Keywords for each category
        const maintenanceKeywords = ['repair', 'broken', 'fix', 'maintenance', 'electrical', 'plumbing', 
            'light', 'ac', 'air conditioning', 'door', 'window', 'leak', 'damage'];
        const lostFoundKeywords = ['lost', 'found', 'missing', 'item', 'belongings', 'wallet', 'phone', 
            'bag', 'left', 'forgot'];
        const incidentKeywords = ['incident', 'accident', 'emergency', 'injury', 'security', 'threat', 
            'suspicious', 'harassment', 'danger'];

        const text = `${data.title} ${data.description}`.toLowerCase();

        // Count matches for each category
        const maintenanceCount = maintenanceKeywords.filter(word => text.includes(word)).length;
        const lostFoundCount = lostFoundKeywords.filter(word => text.includes(word)).length;
        const incidentCount = incidentKeywords.filter(word => text.includes(word)).length;

        // Determine category based on keyword matches
        if (maintenanceCount > lostFoundCount && maintenanceCount > incidentCount) {
            return 'maintenance';
        } else if (lostFoundCount > maintenanceCount && lostFoundCount > incidentCount) {
            return 'lostfound';
        } else if (incidentCount > maintenanceCount && incidentCount > lostFoundCount) {
            return 'incident';
        }

        // If no clear category is determined, use additional context
        if (formData.priority === 'high') {
            return 'incident';
        }
        
        // Default to maintenance if no clear category is found
        return 'maintenance';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const reportType = categorizeReport(formData);
        const submitData = new FormData();

        // Add common fields
        submitData.append('userId', user.id);
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('location', formData.location);
        submitData.append('date', formData.date);
        submitData.append('priority', formData.priority);
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            let endpoint = '';
            switch (reportType) {
                case 'maintenance':
                    endpoint = 'http://localhost:5000/api/reports/create-report';
                    submitData.append('issue_type', 'maintenance');
                    break;
                case 'lostfound':
                    endpoint = 'http://localhost:5000/api/lostandfound/create';
                    submitData.append('item_name', formData.title);
                    submitData.append('item_description', formData.description);
                    break;
                case 'incident':
                    endpoint = 'http://localhost:5000/api/incidents/create';
                    submitData.append('severity', formData.priority);
                    submitData.append('incident_date', formData.date);
                    break;
            }

            const response = await axios.post(endpoint, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                handleClose();
                if (fetchReports) fetchReports();
                resetForm();
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit the report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create New Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            isInvalid={!!errors.title}
                            placeholder="Brief title of your report"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            isInvalid={!!errors.location}
                            placeholder="Where did this occur?"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.location}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            isInvalid={!!errors.description}
                            placeholder="Provide detailed information about your report"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date and Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            isInvalid={!!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.date}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleInputChange}
                            accept="image/*"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Report'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateReportModal;
