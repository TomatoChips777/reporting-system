import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Help icon
import axios from 'axios';
import { useAuth } from '../AuthContext';

const FoundModal = ({ show, handleClose, existingItem, fetchItems }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: user?.id,
        item_id: existingItem?.id,
        location: '',
        description: '',
        image: null
    });

    // Reset form data on modal close or when an item is changed
    useEffect(() => {
        if (show) {
            if (existingItem) {
                setFormData({
                    user_id: user?.id,
                    item_id: existingItem?.id,
                    location: '',
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
            Provide the location where you found the item, a brief description, and upload an image to help verify the item.
        </Tooltip>
    );

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file (image) input changes
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location.trim()) {
            alert('Please provide the location where you found the item');
            return;
        }
        if (!formData.description.trim()) {
            alert('Please provide a description of how/where you found the item');
            return;
        }

        setLoading(true);
        try {
            const url = `http://localhost:5000/api/lostandfound/found-item/${existingItem.id}`;
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                alert('Item successfully marked as found!');
                fetchItems();
                handleClose();
                resetForm();
            } else {
                alert(response.data.message || 'Error reporting the found item');
            }
        } catch (error) {
            console.error('Error reporting found item:', error);
            alert('Error reporting the found item. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Reset form fields after submission or when the modal is closed
    const resetForm = () => {
        setFormData({
            user_id: user?.id,
            item_id: existingItem?.id,
            location: '',
            description: '',
            image: null,
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Report Found Item</Modal.Title>
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
                        <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter where you found the item"
                        />
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
                            placeholder="Describe how and where you found the item"
                        />
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
                            {loading ? <Spinner animation="border" size="sm" /> : 'Report Found'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FoundModal;
