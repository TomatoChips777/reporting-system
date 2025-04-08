import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Image, InputGroup } from 'react-bootstrap';
import { BsFillImageFill, BsSend } from 'react-icons/bs'; // Icons
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const MessageModal = ({ show, handleClose, existingItem, fetchItems }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // Preview selected image
    const [formData, setFormData] = useState({
        sender_id: user?.id,
        receiver_id: existingItem?.user_id,
        report_id: existingItem?.report_id,
        message: '',
        type: '',
        image: null,
    });

    useEffect(() => {
        if (show) {
            resetForm();
        }
    }, [show]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { message, image } = formData;

        if (!message.trim() && !image) return;

        const messageData = new FormData();
        messageData.append("sender_id", user.id);
        messageData.append("receiver_id", existingItem?.user_id);
        messageData.append("report_id", existingItem?.report_id);
        messageData.append("message", message.trim());
        messageData.append('item_type', existingItem?.type);

        if (image) {
            messageData.append("image", image);
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_SEND_MESSAGE}`, messageData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                resetForm();
                fetchItems();
                handleClose();
            } else {
                console.error('Error sending message:', response.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            sender_id: user?.id,
            receiver_id: existingItem?.user_id,
            report_id: existingItem?.report_id,
            message: '',
            type: '',
            image: null,
        });
        setImagePreview(null);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Send a Message</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-3 text-center">
                        <Image src={imagePreview} alt="Preview" thumbnail className="mb-2" style={{ maxHeight: "250px" }} />
                        <Button variant="danger" size="sm" className="ms-1" onClick={removeImage}>Remove</Button>
                    </div>
                )}

                {/* Form with Text Input, File Attachment, and Send Button */}
                <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column">
                        {/* Message Input */}
                        <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Type your message here..."
                            rows={3}
                            style={{ resize: "none", marginBottom: '15px' }}
                        />

                        {/* File attachment and send button at the bottom */}
                        <div className="d-flex justify-content-between align-items-center">
                            {/* File Attachment */}
                            <div className="d-flex align-items-center">
                                <input type="file" id="fileUpload" hidden accept="image/*" onChange={handleFileChange} />
                                <Button variant="outline-secondary" onClick={() => document.getElementById("fileUpload").click()}>
                                    <BsFillImageFill size={18} />
                                </Button>
                                {imagePreview && (
                                    <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>File attached</span>
                                )}
                            </div>
                            {/* Send Button */}
                            <Button 
                                type="submit" 
                                variant="primary" 
                                disabled={loading || (!formData.message.trim() && !formData.image)} 
                                className="ms-3"
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : <BsSend size={18} />}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MessageModal;
