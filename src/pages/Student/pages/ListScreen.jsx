import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';
// import CreateLostFoundModal from '../Junk/LostFoundModal';

const dummyImage = 'https://via.placeholder.com/200?text=No+Image';

function ListScreen() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);

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
                    <input type="text" className="form-control" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="col-md-4 mb-2">
                    <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Items</option>
                        <option value="lost">Lost Items</option>
                        <option value="found">Found Items</option>
                    </select>
                </div>
                <div className="col-md-2 mb-2">
                    <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>Post Item</button>
                </div>
            </div>

            <div className="row">
                {filteredItems.map((item) => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <Card>
                            <Card.Img variant="top" src={item.image_path ? `http://localhost:5000/uploads/${item.image_path}` : dummyImage} alt="No image uploaded" style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>{item.item_name}</Card.Title>
                                <Badge className='rounded-0' bg={item.type === 'lost' ? 'danger' : 'success'}>{item.type.toUpperCase()}</Badge>
                                <Card.Text className="mt-2">
                                    <strong>Category:</strong> {item.category}<br />
                                    <strong>Location:</strong> {item.location}<br />
                                    <strong>Description:</strong> {item.description}<br />
                                    <strong>Contact:</strong> {item.contact_info}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
            {/* <CreateLostFoundModal show={showModal} handleClose={() => setShowModal(false)} fetchItems={fetchItems} /> */}
        </div>
    );
}

export default ListScreen;
