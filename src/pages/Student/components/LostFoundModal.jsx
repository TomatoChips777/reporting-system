import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const CreateLostFoundModal = ({ show, handleClose, fetchItems }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
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
            if (key === 'is_anonymous') {
                formDataObj.append(key, formData[key] ? '1' : '0');
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(
                'http://localhost:5000/api/lostandfound/create-lost-found',
                formDataObj,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                alert('Item posted successfully!');
                handleClose();
                fetchItems();
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error posting item');
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Post Lost or Found Item</Modal.Title>
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
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" name="category" value={formData.category} onChange={handleInputChange} required />
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
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );  
};

export default CreateLostFoundModal;
