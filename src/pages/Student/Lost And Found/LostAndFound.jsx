import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';

const dummyImage = 'https://via.placeholder.com/200?text=No+Image';

function LostAndFound() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
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

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/lostandfound/items');
            if (response.data.success) {
                setItems(response.data.items);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image_path: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (key === 'is_anonymous') {
                formDataObj.append(key, formData[key] ? 1 : 0);
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/lostandfound/create-lost-found', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            if (response.data.success) {
                alert('Item posted successfully!');
                setShowModal(false);
                fetchItems();
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
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error posting item');
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || item.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Lost and Found</h1>

            <div className="row mb-4">
                <div className="col-md-6 mb-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search items..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-4 mb-2">
                    <select 
                        className="form-select" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Items</option>
                        <option value="lost">Lost Items</option>
                        <option value="found">Found Items</option>
                    </select>
                </div>
                <div className="col-md-2 mb-2">
                    <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>
                        Post Item
                    </button>
                </div>
            </div>

            <div className="row">
                {filteredItems.map((item) => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <Card>
                            <Card.Img 
                                variant="top" 
                                src={item.image_path ? `http://localhost:5000/uploads/${item.image_path}` : dummyImage}
                                alt={"No image uploaded"}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{item.item_name}</Card.Title>
                                <Badge className='rounded-0' bg={item.type === 'lost' ? 'danger' : 'success'}>
                                    {item.type.toUpperCase()}
                                </Badge>
                                <Card.Text className="mt-2">
                                    <strong>Category:</strong> {item.category}<br />
                                    <strong>Location:</strong> {item.location}<br />
                                    <strong>Description:</strong> {item.description}<br />
                                    <strong>Contact:</strong> {item.contact_info}<br />
                                    <strong>Posted by:</strong> {item.user_name}<br />
                                    <strong>Date:</strong> {new Date(item.date_reported).toLocaleDateString()}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                            <Form.Control 
                                type="text" 
                                name="item_name" 
                                value={formData.item_name} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="category" 
                                value={formData.category} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleInputChange} 
                                rows={3}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact Info</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="contact_info" 
                                value={formData.contact_info} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="checkbox" 
                                label="Post anonymously" 
                                name="is_anonymous" 
                                checked={formData.is_anonymous} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        
    );
}

export default LostAndFound;