import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Help icon
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const ClaimModal = ({ show, handleClose, existingItem, fetchItems }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        itemId: existingItem?.id,
        claimerId: user.id,
        holderId: existingItem?.user_id,
        description: '',
        claimerName: user?.name,
        type: existingItem?.type,
        item_name: existingItem?.item_name,
        location: existingItem?.location
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDuplicateRequestModal, setShowDuplicateRequestModal] = useState(false);

    useEffect(() => {
        if (show) {
            if (existingItem) {
                setFormData({
                    itemId: existingItem?.id,
                    claimerId: user.id,
                    holderId: existingItem?.user_id,
                    description: '',
                    claimerName: user?.name,
                    type: existingItem?.type,
                    item_name: existingItem?.item_name,
                    location: existingItem?.location
                });
            } else {
                resetForm();
            }
        }
    }, [show, existingItem]);

    const renderTooltip = (props) => (
        <Tooltip id="help-tooltip" {...props} className="bg-white">
            To claim this item, please provide your contact information and a detailed description of the item to prove ownership.
            If possible, upload an image of the item or proof of ownership.
        </Tooltip>
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleClaimAction = async (e) => {
        e.preventDefault();
        const { description } = formData;

        if (!description.trim()) return;

        const claimData = {
            itemId: existingItem?.id,
            claimerId: user.id,
            holderId: existingItem?.user_id,
            description: description.trim(),
            claimerName: user.name,
            type: existingItem?.type,
            item_name: existingItem?.item_name,
            location: existingItem?.location
        };

        setLoading(true);

        try {
            // Send the claim request to the API
            const response = await axios.post(
                `${import.meta.env.VITE_ADD_REQUEST}`, // Your backend API endpoint
                claimData
            );

            if (response.data.success) {
                setShowSuccessModal(true);  // Show the success modal
                resetForm();
                fetchItems();
                handleClose();
            } else {
                alert(response.data.message || 'An error occurred while processing your claim request');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle duplicate claim error
                setShowDuplicateRequestModal(true);
            } else {
                console.error('Error sending claim request:', error);
                alert('An error occurred while processing your claim request');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            itemId: existingItem?.id,
            claimerId: user.id,
            holderId: existingItem?.user_id,
            description: '',
            claimerName: user?.name,
            type: existingItem?.type,
            item_name: existingItem?.item_name,
            location: existingItem?.location
        });
    };

    return (
        <>
            {/* Claim Modal */}
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Claim Found Item</Modal.Title>
                    <OverlayTrigger placement="left" overlay={renderTooltip}>
                        <BsQuestionCircle className="ms-2 text-primary" size={20} style={{ cursor: 'pointer' }} />
                    </OverlayTrigger>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleClaimAction}>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="item_name"
                                value={existingItem ? existingItem.item_name : ''}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Message <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                required
                                placeholder="Describe the item in detail to prove ownership"
                            />
                            <Form.Text className="text-muted">
                                Include specific details about the item that only the owner would know
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Claim Item'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Claim Request Submitted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your claim request has been successfully submitted. The item owner will review your request shortly.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Duplicate Request Modal */}
            <Modal show={showDuplicateRequestModal} onHide={() => setShowDuplicateRequestModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Request Already Sent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have already submitted a claim request for this item. Please wait for the owner to respond.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowDuplicateRequestModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ClaimModal;
