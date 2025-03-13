import { useState, useEffect } from 'react';
import { useAuth } from '../../../../AuthContext';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const UnifiedReportModal = ({ show, handleClose, fetchReports }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        user_id: user?.id,
        title: '',
        description: '',
        location: '',
        image_path: null,
        priority: 'low',
        isAnonymous: false
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
            image_path: null,
            priority: 'low',
            isAnonymous: false
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                image_path: files[0]
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
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
            'bag', 'left', 'forgot', 'looking'];
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

        // // If no clear category is determined, use additional context
        // if (formData.priority === 'high') {
        //     return 'incident';
        // }
        
        // Default to maintenance if no clear category is found
        return 'maintenance';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // const reportType = categorizeReport(formData);
    
        // Check for "lost" or "found" in the title or description
        

        setLoading(true);
        const reportType = categorizeReport(formData);

        let type = 'lost';
        const text = `${formData.title} ${formData.description}`.toLowerCase();
        if (text.includes('found')) {
            type = 'found';
        } else if (text.includes('lost')) {
            type = 'lost';
        }
        const submitData = new FormData();
        submitData.append('user_id', formData.isAnonymous ? 'anonymous' : user.id);
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('location', formData.location);
        submitData.append('priority', formData.priority);
        submitData.append('isAnonymous', formData.isAnonymous);
        submitData.append('type', type);
        if (formData.image_path) {
            submitData.append('image_path', formData.image_path);
        }

        try {
            let endpoint = '';
            switch (reportType) {
                case 'maintenance':
                    endpoint = 'http://localhost:5000/api/unified-reports/create-report';
                    submitData.append('issue_type', 'maintenance');
                    break;
                case 'lostfound':
                    endpoint = 'http://localhost:5000/api/unified-reports/create-lost-found';
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
                // if (fetchReports) fetchReports();
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

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Submit as anonymous"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={handleInputChange}
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

export default UnifiedReportModal;
