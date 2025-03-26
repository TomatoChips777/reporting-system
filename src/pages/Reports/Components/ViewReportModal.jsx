import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ViewReportModal = ({ show, onHide, report, onUpdateType, onUpdateStatus, onChange }) => {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {report ? (
                    <div>
                        <p className="text-break"><strong>Date:</strong> {new Date(report.created_at).toLocaleString('en-US', {
                            timeZone: 'Asia/Manila',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        })}</p>
                        <p className="text-break"><strong>Reported By:</strong> {report.reporter_name}</p>
                        <p className="text-break"><strong>Location:</strong> {report.location}</p>
                        <p className="text-break"><strong>Description:</strong> {report.description}</p>

                        {/* Image Display */}
                        {report.image_path && (
                            <div className="mb-3 d-flex flex-column align-items-center text-center">
                                <strong>Attached Image:</strong>
                                <img
                                    src={`http://localhost:5000/uploads/${report.image_path}`}
                                    alt="Report"
                                    className="img-fluid mt-2"
                                    style={{ maxHeight: "300px", borderRadius: "10px" }}
                                />
                            </div>
                        )}
                        {/* Show Additional Fields if Report Type is Lost And Found */}
                        {report.report_type === "Lost And Found" && (
                            <>
                             <Form.Group controlId="type">
                                <Form.Label>Type</Form.Label>
                                <Form.Select name="type" value={report.type || ""} onChange={onChange}>
                                    <option value="lost">Lost</option>
                                    <option value="found">Found</option>
                                </Form.Select>
                            </Form.Group>
                                <Form.Group controlId="itemName">
                                    <Form.Label><strong>Item Name:</strong></Form.Label>
                                    <Form.Control type="text" name="item_name" value={report.item_name || ""} onChange={onChange} required />
                                </Form.Group>

                                <Form.Group controlId="category">
                                    <Form.Label><strong>Category:</strong></Form.Label>
                                    <Form.Control type="text" name="category" value={report.category || ""} onChange={onChange} required />
                                </Form.Group>

                                <Form.Group controlId="contactInfo">
                                    <Form.Label><strong>Contact Info:</strong></Form.Label>
                                    <Form.Control type="text" name="contact_info" value={report.contact_info || ""} onChange={onChange} required />
                                </Form.Group>

                                {/* <Form.Group controlId="isAnonymous">
                                    <Form.Check 
                                        type="checkbox" 
                                        label="Report Anonymously" 
                                        name="is_anonymous" 
                                        checked={report.is_anonymous || false} 
                                        onChange={onChange} 
                                    />
                                </Form.Group> */}
                            </>
                        )}
                        {/* Report Type Selection */}
                        <Form.Group controlId="statusSelect">
                            <Form.Label><strong>Report Type:</strong></Form.Label>
                            <Form.Select value={report.report_type} onChange={onUpdateType} className="rounded-0" required>
                                <option value="">Select Report Type</option>
                                <option value="Maintenance Report">Maintenance Report</option>
                                <option value="Incident Report">Incident Report</option>
                                <option value="Lost And Found">Lost And Found Report</option>
                            </Form.Select>
                        </Form.Group>

                        
                    </div>
                ) : (
                    <p>No details available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="rounded-0" onClick={onHide}>Close</Button>
                <Button variant="primary" className="rounded-0" onClick={onUpdateStatus}>Update Report Type</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewReportModal;
