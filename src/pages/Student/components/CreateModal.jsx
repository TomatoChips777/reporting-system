import { useState, useEffect } from 'react';
import { useAuth } from '../../../../AuthContext';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
const ReportModal = ({ show, handleClose, existingReport, fetchReports, setReports }) => {
    const { user } = useAuth();
    const [location, setLocation] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);

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

    const handleDeleteReport = async () => {
        if (existingReport && status === "pending") {
            if (!confirmDelete) return;

            try {
                const response = await axios.delete(`http://localhost:5000/api/reports/report/${existingReport.id}`, {
                    data: {
                        userId: user.id,
                    },
                });

                if (response.data.success) {
                    setReports((prevReports) =>
                        prevReports.filter((report) => report.id !== existingReport.id)
                    );
                    setShowDeleteModal(false);
                    setReportToDelete(null);
                } else {
                    alert(response.data.message || "Failed to delete the report.");
                }
            } catch (error) {
                console.error("Error deleting report:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            alert("Only pending reports can be deleted.");
        }
    };

    const confirmDelete = (reportID) => {
        setReportToDelete(reportID);
        setShowDeleteModal(true);
        handleClose();            

    };

    const handleSubmit = async () => {
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
            if (existingReport) {

                await updateReport();
            } else {

                await createReport();
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setLoading(false);
        }
    };
   const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setReportToDelete(null);
    };


    const createReport = async () => {
        const formData = new FormData();
        formData.append("userId", user.id);
        formData.append("location", location);
        formData.append("issueType", issueType);
        formData.append("description", description);
        if (image instanceof File) formData.append("image", image);

        try {
            const response = await axios.post("http://localhost:5000/api/reports/create-report", formData);
            setLoading(false);

            if (response.data.success) {
                handleClose();
                setShowSuccessModal(true);
                fetchReports();
            }
        } catch (error) {
            console.error("Error creating report:", error);
            setLoading(false);
            alert("Failed to submit the report. Please try again.");
        }
    };

    const updateReport = async () => {
        const formData = new FormData();
        formData.append("userId", user.id);
        formData.append("location", location);
        formData.append("issueType", issueType);
        formData.append("description", description);
        if (image instanceof File) formData.append("image", image);

        try {
            const response = await axios.put(
                `http://localhost:5000/api/reports/${existingReport.id}`,
                formData
            );
            setLoading(false);

            if (response.data.success) {
                handleClose();
                setShowSuccessModal(true);
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.id === existingReport.id
                            ? { ...report, location, issue_type: issueType, description, image_path: image || report.image_path }
                            : report
                    )
                );
            }
        } catch (error) {
            console.error("Error updating report:", error);
            setLoading(false);
            alert("Failed to update the report. Please try again.");
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
                            <strong>Editing or deleting is not allowed.</strong> This report is already <strong>{status.replace('_', ' ')}</strong>.
                        </Alert>
                    )}


                    {image && typeof image === "string" && (
                        <div className="mb-3 text-center">
                            <h6>Uploaded Image</h6>
                            <img
                                src={`http://localhost:5000/uploads/${image}`}
                                alt="Uploaded"
                                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", marginBottom: "10px" }}
                            />
                        </div>
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
                    <Button variant="secondary rounded-0" onClick={handleClose}>Close</Button>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={loading || isEditingDisabled}
                        className='rounded-0'
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : (existingReport ? 'Update Report' : 'Submit Report')}
                    </Button>
                    {existingReport && (
                        <Button variant="danger" className='rounded-0' onClick={() => confirmDelete(existingReport.id)} disabled={loading || isEditingDisabled} >Delete</Button>
                    )}
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
                    <Button variant="success" className='rounded-0' onClick={handleSuccessClose}>OK</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this report? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='rounded-0' onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" className='rounded-0' onClick={handleDeleteReport}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReportModal;
