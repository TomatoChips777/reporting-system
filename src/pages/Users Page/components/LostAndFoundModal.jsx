import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const LostAndFoundModal = ({ show, handleClose, fetchItems, existingItem }) => {
    const { user } = useAuth();
    // Initialize form state based on existing item or default values
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
        status: 'open',
    });

    useEffect(() => {
        if (show) {
            if (existingItem) {
                setFormData({
                    user_id: existingItem.user_id || user?.id,
                    type: existingItem.type || 'lost',
                    item_name: existingItem.item_name || '',
                    category: existingItem.category || '',
                    description: existingItem.description || '',
                    location: existingItem.location || '',
                    contact_info: existingItem.contact_info || '',
                    is_anonymous: !!existingItem.is_anonymous,
                    image_path: null,
                    status: existingItem.status || 'open',
                });
            } else {
                resetForm();
            }
        }
    }, [show, existingItem]);
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
        const formDataObj = new FormData();

        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key] === true ? '1' : formData[key]);
        });

        try {
            const url = existingItem
            ? `${import.meta.env.VITE_UPDATE_ITEM}/${existingItem.id}`
            : `${import.meta.env.VITE_CREATE_LOST_AND_FOUND}`; 
            const method = existingItem ? 'put' : 'post';
            const response = await axios({
                method,
                url,
                data: formDataObj,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert(`Item ${existingItem ? 'updated' : 'posted'} successfully!`);
                handleClose();
                fetchItems();
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error ${existingItem ? 'updating' : 'posting'} item`);
        }
    };


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
            image_path: null
        });
    };

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{existingItem ? 'Edit' : 'Post'} Lost or Found Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
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
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Info</Form.Label>
                        <Form.Control type="text" name="contact_info" value={formData.contact_info} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Post anonymously" name="is_anonymous" checked={formData.is_anonymous} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit">{existingItem ? 'Update' : 'Submit'}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
export default LostAndFoundModal;
