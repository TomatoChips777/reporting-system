import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Help icon
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const UpdateModal = ({ show, handleClose, existingReport }) => {
    const { user } = useAuth();
    const [reportType, setReportType] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        user_id: user?.id,
        type: 'maintenance',
        item_name: '',
        category: '',
        description: '',
        location: '',
        contact_info: '',
        is_anonymous: false,
        image_path: null,
        issue_type: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && existingReport) {
            const reportType = existingReport.type === 'lost' || existingReport.type === 'found' ? 'lostfound' : 
                             existingReport.type === 'maintenance' ? 'maintenance' : 'incident';
            
            setFormData({
                ...existingReport,
                user_id: existingReport.user_id || user?.id,
                item_name: existingReport.item_name || existingReport.title || '',
                issue_type: existingReport.issue_type || existingReport.title || '',
                type: existingReport.type || 'lost',
                image_path: existingReport.image_path || null,
            });
            setReportType(reportType);
            setErrors({});
            setTouched({});
        } else if (!show) {
            resetForm();
        }
    }, [show, existingReport]);

    const validateField = (name, value) => {
        switch (name) {
            case 'item_name':
                return value.trim() ? '' : 'Item name is required';
            case 'category':
                return value.trim() ? '' : 'Category is required';
            case 'description':
                return value.trim() ? '' : 'Description is required';
            case 'location':
                return value.trim() ? '' : 'Location is required';
            case 'contact_info':
                return value.trim() ? '' : 'Contact information is required';
            case 'issue_type':
                return value.trim() ? '' : 'Issue type is required';
            default:
                return '';
        }
    };

    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
        
        if (touched[name]) {
            const error = validateField(name, newValue);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const resetForm = () => {
        setReportType('maintenance'); // Default to maintenance
        setFormData({
            user_id: user?.id,
            type: 'maintenance', // Default for new reports
            item_name: '',
            category: '',
            description: '',
            location: '',
            contact_info: '',
            is_anonymous: false,
            image_path: null,
            issue_type: '',
        });
        setErrors({});
        setTouched({});
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = reportType === 'lostfound' 
            ? ['item_name', 'category', 'description', 'location', 'contact_info']
            : ['issue_type', 'description', 'location'];

        requiredFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Mark all fields as touched to show errors
            const allTouched = {};
            Object.keys(formData).forEach(key => {
                allTouched[key] = true;
            });
            setTouched(allTouched);
            return;
        }

        setLoading(true);

        const formDataObj = new FormData();
        
        // Ensure type is set correctly for new lost & found reports
        if (reportType === 'lostfound' && (!formData.type || formData.type === 'maintenance')) {
            formData.type = 'lost'; // Default to 'lost' when converting from maintenance
        }
        
        Object.keys(formData).forEach((key) => {
            if (key === 'image_path' && formData[key]) {
                // Append the actual file object for image_path
                formDataObj.append(key, formData[key]);
            } else {
                formDataObj.append(key, formData[key] === true ? '1' : formData[key]);
            }
        });
        // Object.keys(formData).forEach((key) => {
        //     formDataObj.append(key, formData[key] === true ? '1' : formData[key]);
        // });

        try {
            let endpoint, method;
            // Check if the report type has changed
            // const isTypeChanged = existingReport && reportType !== existingReport.type;
            const isTypeChanged = existingReport && reportType !== (
                existingReport.type === 'lost' || existingReport.type === 'found' ? 'lostfound' :
                existingReport.type === 'maintenance' ? 'maintenance' : 'incident'
            );

            if (isTypeChanged) {

                if (reportType === 'lostfound') {
                    await axios.put(`http://localhost:5000/api/unified-reports/reports/archive-maintenance-report/${existingReport.id}`);
                } else {
                    await axios.put(`http://localhost:5000/api/unified-reports/reports/archive-lost-found-report/${existingReport.id}`);
                }
                endpoint = reportType === 'lostfound'
                   ? 'http://localhost:5000/api/unified-reports/create-lost-found':
                    'http://localhost:5000/api/unified-reports/create-report';
                method = 'post';

                
            } else {
                // Update existing report
                endpoint = reportType === 'lostfound'
                    ? `http://localhost:5000/api/lostandfound/items/${existingReport.id}`
                    : `http://localhost:5000/api/reports/${existingReport.id}`;
                method = 'put';
            }

            
            const response = await axios({
                method,
                url: endpoint,
                data: formDataObj,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                alert(isTypeChanged ? 'New report created successfully!' : 'Report updated successfully!');
                handleClose();
                resetForm();
            }
        } catch (error) {
            console.error('Error: data', error);
            alert('Error submitting report');
        } finally {
            setLoading(false);
        }
    };
    const baseUrl = 'http://localhost:5000/uploads/';

    const imageUrl = formData.image_path 
        ? (typeof formData.image_path === 'string' ? `${baseUrl}${formData.image_path}` : URL.createObjectURL(formData.image_path))
        : null;
    
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image_path: e.target.files[0],
        }));
    };

    const renderTooltip = (props) => (
        <Tooltip id="help-tooltip" {...props} className='bg-white'>
            Select the report type and fill in the details.<br />
            - <b>Lost & Found:</b> Report lost or found items.<br />
            - <b>Maintenance:</b> Report building or facility issues.<br />
            - <b>Incident:</b> Report any incidents on campus.
        </Tooltip>
    );
    return (
        <Modal show={show} onHide={handleClose} centered size='lg' backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Update Report</Modal.Title>
                <OverlayTrigger placement="left" overlay={renderTooltip}>
                    <BsQuestionCircle className="ms-2 text-primary" size={20} style={{ cursor: 'pointer' }} />
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Report Type</Form.Label>
                        <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <option value="maintenance">Maintenance Report</option>
                            <option value="lostfound">Lost & Found</option>
                            <option value="incident">Incident Report</option>
                        </Form.Select>
                    </Form.Group>
                    {reportType === 'lostfound' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleInputChange}
                                >
                                    <option value="lost">Lost</option>
                                    <option value="found">Found</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="item_name" 
                                    value={formData.item_name} 
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.item_name && !!errors.item_name}
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.item_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.category && !!errors.category}
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
                                <Form.Control.Feedback type="invalid">
                                    {errors.category}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Contact Info</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="contact_info" 
                                    value={formData.contact_info} 
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.contact_info && !!errors.contact_info}
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contact_info}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" label="Post anonymously" name="is_anonymous" checked={formData.is_anonymous} onChange={handleInputChange} />
                            </Form.Group>
                        </>
                    )}
                    {reportType === 'maintenance' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Issue Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="issue_type"
                                value={formData.issue_type}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                isInvalid={touched.issue_type && !!errors.issue_type}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.issue_type}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            isInvalid={touched.description && !!errors.description}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            isInvalid={touched.location && !!errors.location}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.location}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                        {imageUrl && (
        <div className="mt-2">
            <img src={imageUrl} alt="Uploaded Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    )}
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
export default UpdateModal;
