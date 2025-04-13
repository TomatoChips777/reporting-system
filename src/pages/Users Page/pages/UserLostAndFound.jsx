import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure Bootstrap Icons are imported
import { Card, Badge, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../../AuthContext';
import LostAndFoundModal from '../components/LostAndFoundModal';
import ClaimModal from '../components/ClaimModal';
const dummyImage = 'https://via.placeholder.com/200?text=No+Image';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSidebarState } from '../../../components/SidebarStateContext';

function UserLostAndFound() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setSidebarOpen } = useSidebarState();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [existingItem, setExistingItem] = useState(null);

    useEffect(() => {
        setSidebarOpen(false);
        fetchItems();
        const socket = io(`${import.meta.env.VITE_API_URL}`);

        socket.on('update', () => {

            fetchItems();
        });

        
        return () => {
            socket.disconnect();
        };
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
    const handleClaimModal = (item) => {
        setExistingItem(item);
        setShowClaimModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleCloseClaimModal = () => {
        setShowClaimModal(false);
    }
    const filteredItems = items.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || item.type === filter;
        const mathesFilterCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesFilter && mathesFilterCategory;
    });

    return (
        <div className="container-fluid">
            {/* Header Section with Additional Information */}
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
                                    {/* Opens the modal to create a new lost and found report */}
                                    <Button
                                        className="btn btn-light btn-lg rounded-0"
                                        onClick={() => handleOpenModal()}
                                    >
                                        <i className="bi bi-plus-lg me-2"></i>Create Report
                                    </Button>
                                </div>
                            </div>
                            {/* Search & Filter Section */}
                            <div className="row mt-3 align-items-center">
                                <div className="col-md-5">
                                    <Form.Control
                                        type="text"
                                        className="shadow-sm rounded-0"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
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
                                <div className="col-md-3">
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

            {/* Item List Container with Scrollable Feature */}
            <div className="row">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        // <div key={item.id} className="col-md-3 mb-3">
                        <div key={item.id} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                            <Card className="shadow-sm border-0 rounded h-100">
                                <Card.Img
                                    variant="top"
                                    src={item.image_path ? `${import.meta.env.VITE_IMAGES}/${item.image_path}` : dummyImage}
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
                                {/* Action Buttons */}
                                <div className="p-2">
                                    {user?.id === item.user_id ? (
                                        <Button
                                            variant="primary"
                                            className="rounded-0 w-100 text-white"
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            Edit
                                        </Button>
                                    ) : (
                                        <>
                                            {item.type === 'lost' && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Click if you found this lost item</Tooltip>}
                                                >
                                                    <Button variant="info" className="rounded-0 text-white w-100" onClick={() => handleClaimModal(item)}>
                                                        Return Item
                                                    </Button>
                                                </OverlayTrigger>
                                            )}
                                            {item.type === 'found' && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Click to claim this found item</Tooltip>}
                                                >
                                                    <Button variant="success" className="rounded-0 w-100" onClick={() => handleClaimModal(item)}>
                                                        Claim
                                                    </Button>
                                                </OverlayTrigger>
                                            )}
                                        </>
                                    )}
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
            <LostAndFoundModal
                show={showModal}
                handleClose={() => handleCloseModal()}
                fetchItems={fetchItems}
                existingItem={existingItem}
            />

            <ClaimModal
                show={showClaimModal}
                handleClose={handleCloseClaimModal}
                existingItem={existingItem}
                fetchItems={fetchItems}
            />
        </div>
    );
}
export default UserLostAndFound;
