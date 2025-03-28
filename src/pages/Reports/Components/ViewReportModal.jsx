import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

const ViewReportModal = ({ show, onHide, report, onUpdateType, onUpdateStatus, onChange }) => {
    const [customCategory, setCustomCategory] = useState("");

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        onChange(e);
        if (selectedCategory === "Other") {
            setCustomCategory("");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {report ? (
                    <>
                        {/* Details in a Bootstrap Card */}
                        <Card className="mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", padding: "15px" }}>
                            <Card.Body>
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
                                <p className="text-break"><strong>Description:</strong></p>
                                <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '5px', minHeight: '50px' }}>
                                    <p className="m-0">{report.description}</p>
                                </div>
                            </Card.Body>
                            {/* Image Display */}
                            {report.image_path && (
                                <div className="mb-3 d-flex flex-column align-items-center text-center">
                                    <strong>Attached Image:</strong>
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                                        alt="Report"
                                        className="img-fluid mt-2"
                                        style={{ maxHeight: "300px", borderRadius: "10px" }}
                                    />
                                </div>
                            )}
                        </Card>
                        {/* Additional Fields for Lost And Found */}
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
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select name="category" value={report.category} onChange={onChange} required>
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
                                <Form.Group controlId="contactInfo">
                                    <Form.Label><strong>Contact Info:</strong></Form.Label>
                                    <Form.Control type="text" name="contact_info" value={report.contact_info || ""} onChange={onChange} required />
                                </Form.Group>
                            </>
                        )}



                        {/* Maintenance Report Fields */}
                        {report.report_type === "Maintenance Report" && (
                            <>
                                <Form.Group controlId="maintenanceCategory">
                                    <Form.Label><strong>Category:</strong></Form.Label>
                                    <Form.Select name="category" value={report.category || ""} onChange={onChange} required>
                                        <option value="">Select Category</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="General Repair">General Repair</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>


                                <Form.Group controlId="priority">
                                    <Form.Label><strong>Priority:</strong></Form.Label>
                                    <Form.Select name="priority" value={report.priority || ""} onChange={onChange} required>
                                        <option value="">Select Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>

                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="assignedStaff">
                                    <Form.Label><strong>Assigned Staff:</strong></Form.Label>
                                    <Form.Control type="text" name="assigned_staff" value={report.assigned_staff || ""} onChange={onChange} required />
                                </Form.Group>

                                <Form.Group controlId="status">
                                    <Form.Label><strong>Status:</strong></Form.Label>
                                    <Form.Select name="status" value={report.status || ""} onChange={onChange} required>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}

                        {/* Report Type Selection */}
                        <Form.Group controlId="statusSelect">
                            <Form.Label><strong>Report Type:</strong></Form.Label>
                            <Form.Select value={report.report_type || ""} onChange={onUpdateType} className="rounded-0" required>
                                <option value="">Select Report Type</option>
                                <option value="Maintenance Report">Maintenance Report</option>
                                <option value="Incident Report">Incident Report</option>
                                <option value="Lost And Found">Lost And Found Report</option>
                            </Form.Select>
                        </Form.Group>
                    </>
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
