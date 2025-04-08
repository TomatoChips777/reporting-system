import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure Bootstrap Icons are imported
import { Card, Badge, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';
import LostAndFoundModal from './components/LostAndFoundModal';
const dummyImage = 'https://via.placeholder.com/200?text=No+Image';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../Messages/components/MessageModal';
import LostAndFoundViewModal from './components/LostAndFoundViewModal';
function AdminLostAndFound() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [existingItem, setExistingItem] = useState(null);
    const [showMessageInputModal, setShowMessageInputModal] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [claimData, setClaimData] = useState([]);
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_LOST_AND_FOUND}`);
            if (response.data.success) {
                setItems(response.data.items);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleOpenModal = (item = null) => {
        setExistingItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleMessage = (item) => {
        setExistingItem(item);
        setShowMessageInputModal(true);
    }
    const handleCloseMessageModal = () => {
        setShowMessageInputModal(false);
    }
    const filteredItems = items.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesFilterCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesFilter && matchesFilterCategory;
    });


    const handleViewDetails = (item) => {
        getClaimData(item);
        setSelectedItem(item);
        setShowViewModal(true);
    }

    const getClaimData = async (item) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_CLAIMS_BY_ITEM_ID}/${item.id}`);
            setClaimData(response.data.claims);
        } catch (error) {
            console.error("Error fetching claims", error);
        }

    }
    return (
        <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-2">
                <div className="col-12">
                    <div className="card bg-success text-white">
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <i className="bi bi-box-fill display-4"></i>
                                </div>
                                <div className="col">
                                    <h2 className="mb-0">Lost And Found</h2>
                                    <p className="mb-0">Report lost and found items on campus</p>
                                </div>
                                <div className="col-auto">
                                    <Button className="btn btn-light btn-lg rounded-0" onClick={() => handleOpenModal()}>
                                        <i className="bi bi-plus-lg me-2"></i>Create Report
                                    </Button>
                                </div>
                            </div>

                            {/* Search & Filters - Responsive */}
                            <div className="row mt-3 gy-2">
                                <div className="col-12 col-md-5">
                                    <Form.Control
                                        type="text"
                                        className="shadow-sm rounded-0"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-6 col-md-4">
                                    <Form.Select
                                        className="rounded-0 shadow-sm"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">All Items</option>
                                        <option value="lost">Lost Items</option>
                                        <option value="found">Found Items</option>
                                    </Form.Select>
                                </div>
                                <div className="col-6 col-md-3">
                                    <Form.Select
                                        className="rounded-0 shadow-sm"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="all">All Category</option>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="row">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                            <Card className="shadow-sm border-0 rounded h-100">
                                <Card.Img
                                    variant="top"
                                    src={item.image_path ? `${import.meta.env.VITE_IMAGE}/${item.image_path}` : dummyImage}
                                    alt="No image uploaded"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    className="rounded-top"
                                />
                                <Card.Body>
                                    <Card.Title className="fw-bold text-truncate">{item.item_name}</Card.Title>
                                    <Badge className="mb-2 rounded-0" bg={item.type === 'lost' ? 'danger' : 'success'}>
                                        {item.type.toUpperCase()}
                                    </Badge>
                                    <Card.Text className="mt-2 text-truncate">
                                        <small className='text-muted small'>Location:</small> {item.location}<br />
                                        <small className='text-muted small'>Description:</small> {item.description
                                            ? (item.description.length > 50
                                                ? item.description.substring(0, 50) + "..."
                                                : item.description)
                                            : "No description provided"}
                                        <br />
                                        <small className='text-muted small'>Contact:</small> {item.contact_info}<br />
                                        <small className='text-muted small'>Reported By:</small> {item.user_name}
                                    </Card.Text>
                                </Card.Body>
                                <div className="p-2 d-flex flex-wrap justify-content-center gap-2">
                                    <Button variant="primary" className="rounded-0 px-3" onClick={() => handleOpenModal(item)}>Edit</Button>
                                    <Button
                                        variant="success position-relative"
                                        className="rounded-0 px-3"
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        View Details
                                        {item.claim_count > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {item.claim_count}
                                            </span>
                                        )}
                                    </Button>
                                    <Button
                                        variant="info"
                                        className="rounded-0 px-3"
                                        onClick={() => handleMessage(item)}
                                        disabled={user.id === item.user_id}
                                    >
                                        Message
                                    </Button>
                                </div>

                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No items posted.</h5>
                    </div>
                )}
            </div>
            <MessageModal
                show={showMessageInputModal}
                handleClose={handleCloseMessageModal}
                existingItem={existingItem}
                fetchItems={fetchItems}
            />
            <LostAndFoundModal
                show={showModal}
                handleClose={handleCloseModal}
                fetchItems={fetchItems}
                existingItem={existingItem}
            />

            <LostAndFoundViewModal
                showModal={showViewModal}
                setShowModal={setShowViewModal}
                selectedItem={selectedItem}
                fetchItems={fetchItems}
                claimData={claimData}
            />
        </div>
    );
}

export default AdminLostAndFound;
