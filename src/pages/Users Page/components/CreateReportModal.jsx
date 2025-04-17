import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const CreateReportModal = ({ show, handleClose, fetchItems }) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        user_id: user?.id,
        description: '',
        location: '',
        is_anonymous: false,
        image_path: null,
    });

    useEffect(() => {
        if (show) resetForm();
    }, [show]);

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
                `${import.meta.env.VITE_CREATE_REPORT}`,
                formDataObj,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.success) {
                handleClose();
                fetchItems?.();
                resetForm();
            }
        } catch (error) {
            alert('Error submitting report');
        }
    };

    const resetForm = () => {
        setFormData({
            user_id: user?.id,
            description: '',
            location: '',
            is_anonymous: false,
            image_path: null,
        });
    };

    return (
        <Modal show={show} onHide={handleClose} size='xl' backdrop="static" keyboard={false} >
            <Modal.Header closeButton>
                <Modal.Title>Submit Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
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

export default CreateReportModal;
