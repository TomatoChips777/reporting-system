import { useState, useEffect } from 'react';
import { useAuth } from '../../../../AuthContext';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const ReportModal = ({ show, handleClose, existingReport, fetchReports }) => {
    const { user } = useAuth();
    const [location, setLocation] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            if (existingReport) {
                setLocation(existingReport.location || '');
                setIssueType(existingReport.issue_type || '');
                setDescription(existingReport.description || '');
                setImage(existingReport.image_path || null);
                setStatus(existingReport.status || ''); // Ensure lowercase status is stored
            } else {
                resetForm();
            }
        }
    }, [show, existingReport]);

    const resetForm = () => {
        setLocation('');
        setIssueType('');
        setDescription('');
        setImage(null);
        setStatus('');
        setErrors({});
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        resetForm();
    };

    const handleSubmit = async () => {
        // if (status !== "pending") return; // Ensure only "pending" reports can be edited

        const newErrors = {};
        if (!location) newErrors.location = true;
        if (!issueType) newErrors.issueType = true;
        if (!description) newErrors.description = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("location", location);
            formData.append("issueType", issueType);
            formData.append("description", description);
            if (image instanceof File) formData.append("image", image);

            const response = await fetch(
                existingReport
                    ? `http://localhost:5000/api/reports/${existingReport.id}`
                    : "http://localhost:5000/api/reports/create-report",
                {
                    method: existingReport ? "PUT" : "POST",
                    body: formData
                }
            );

            const result = await response.json();
            setLoading(false);

            if (result.success) {
                handleClose();
                setShowSuccessModal(true); 
                fetchReports();
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setLoading(false);
        }
    };

    // Check if editing is disabled based on lowercase status
    const isEditingDisabled = existingReport && (status === "in_progress" || status === "resolved");

    return (
        <>
            {/* Main Report Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{existingReport ? 'Edit Report' : 'Submit New Report'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEditingDisabled && (
                        <Alert variant="warning">
                            <strong>Editing is not allowed.</strong> This report has a status of <strong>{status}</strong>.
                        </Alert>
                    )}

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Building A, Room 101"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={errors.location ? 'is-invalid' : ''}
                                disabled={isEditingDisabled}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Issue Type</Form.Label>
                            <Form.Select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className={errors.issueType ? 'is-invalid' : ''}
                                disabled={isEditingDisabled}
                            >
                                <option value="">Select issue type</option>
                                <option value="plumbing">Plumbing Issue</option>
                                <option value="electrical">Electrical Problem</option>
                                <option value="structural">Structural Damage</option>
                                <option value="cleaning">Cleaning Required</option>
                                <option value="safety">Safety Concern</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Provide more details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={errors.description ? 'is-invalid' : ''}
                                disabled={isEditingDisabled}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                disabled={isEditingDisabled}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={loading || isEditingDisabled}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : (existingReport ? 'Update Report' : 'Submit Report')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleSuccessClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {existingReport ? "Your report has been updated successfully!" : "Your report has been submitted successfully!"}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>OK</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReportModal;
