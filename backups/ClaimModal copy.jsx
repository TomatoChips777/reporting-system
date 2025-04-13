import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Help icon
import axios from 'axios';
import { useAuth } from '../AuthContext';

const ClaimModal = ({ show, handleClose, existingItem, fetchItems }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: user?.id,
        item_id: existingItem?.id,
        contact_info: '',
        description: '',
        image: null,
        
    });

    useEffect(() => {
        if (show) {
            if (existingItem) {
                setFormData({
                    user_id: user?.id,
                    item_id: existingItem?.id,
                    contact_info: '',
                    description: '',
                    image: null,
                });
            } else {
                resetForm();
            }
        }
    }, [show, existingItem]);

    // Tooltip for the help icon
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.contact_info.trim()) {
            alert('Please provide your contact information');
            return;
        }
        if (!formData.description.trim()) {
            alert('Please provide a description to prove ownership');
            return;
        }

        setLoading(true);
        try {
            const url = `http://localhost:5000/api/lostandfound/claim-item/${existingItem.id}`;
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Claim submitted successfully! This will be notified and will contact you if your claim is verified.');
                fetchItems();
                handleClose();
                resetForm();
            } else {
                alert(response.data.message || 'Error submitting claim');
            }
        } catch (error) {
            console.error('Error claiming the item:', error);
            alert('Error submitting claim. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            user_id: user?.id,
            item_id: existingItem?.id,
            contact_info: '',
            description: '',
            image: null,
            claim_date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Claim Found Item</Modal.Title>
                <OverlayTrigger placement="left" overlay={renderTooltip}>
                    <BsQuestionCircle className="ms-2 text-primary" size={20} style={{ cursor: 'pointer' }} />
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                        <Form.Label>Contact Info <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="contact_info"
                            value={formData.contact_info}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your contact information"
                        />
                        <Form.Text className="text-muted">
                            This will be shared with the item owner to contact you
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
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
    );
};

export default ClaimModal;
