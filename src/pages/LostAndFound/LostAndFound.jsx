import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Badge, Button, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';
import LostAndFoundModal from './components/LostAndFoundModal';
import LostAndFoundViewModal from './components/LostAndFoundViewModal';
import MessageModal from '../Messages/components/MessageModal';
import { useNavigate } from 'react-router-dom';

const dummyImage = 'https://via.placeholder.com/200?text=No+Image';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchItems();

        setCurrentPage(1);
    }, [searchTerm, filter, filterCategory]);

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
        // console.log(item);
        setExistingItem(item);
        setShowMessageInputModal(true);
    };

    const handleCloseMessageModal = () => {
        setShowMessageInputModal(false);
    };

    const handleViewDetails = (item) => {
        getClaimData(item);
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const getClaimData = async (item) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_CLAIMS_BY_ITEM_ID}/${item.id}`);
            setClaimData(response.data.claims);
        } catch (error) {
            console.error("Error fetching claims", error);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesFilterCategory = filterCategory === 'all' || item.category === filterCategory;

        return matchesSearch && matchesFilter && matchesFilterCategory;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <div className="container-fluid">
            {/* Header */}
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
                            {/* Filters */}
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

            <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                    <strong>Lost and Found Item List</strong>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        {filteredItems.length > 0 ? (
                            <table className="table table-bordered table-hover mb-0">
                                <thead className="table-success">
                                    <tr>
                                        <th>#</th>
                                        <th>Item Name</th>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Description</th>
                                        <th>Contact</th>
                                        <th>Reported By</th>
                                        <th className='text-center align-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                           {/* <td style={{ width: '150px', height: '100px', padding: 0 }}>
                                                <img
                                                    src={item.image_path ? `${import.meta.env.VITE_IMAGES}/${item.image_path}` : dummyImage}
                                                    alt="No image Attached"
                                                    className="w-100 h-90"
                                                    style={{ objectFit: 'cover', display: 'block' }}
                                                />
                                            </td> */}
                                            <td>{item.id}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.type.toUpperCase()}</td>
                                            <td>{item.location}</td>
                                            <td style={{ maxWidth: '200px' }}>
                                                {item.description
                                                    ? (item.description.length > 50
                                                        ? item.description.substring(0, 50) + "..."
                                                        : item.description)
                                                    : "No description"}
                                            </td>
                                            <td>{item.contact_info}</td>
                                            <td>{item.user_name}</td>
                                            <td className='d-flex justify-content-center'>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="rounded-0 me-2"
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="rounded-0 position-relative"
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
                                                    variant="success"
                                                    size="sm"
                                                    className="rounded-0 ms-2"
                                                    onClick={() => handleMessage(item)}
                                                    disabled={user.id === item.user_id}
                                                >
                                                    Message
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-5">
                                <h5 className="text-muted">No items posted.</h5>
                            </div>
                        )}
                    </div>
                </Card.Body>
                {filteredItems.length > itemsPerPage && (
                    <Card.Footer className="bg-light d-flex justify-content-end">
                        <Pagination className="mb-0">
                            <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            />

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Pagination.Item
                                    key={pageNum}
                                    active={pageNum === currentPage}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            />
                        </Pagination>
                    </Card.Footer>
                )}
            </Card>

            {/* Modals */}
            <LostAndFoundModal
                show={showModal}
                handleClose={handleCloseModal}
                existingItem={existingItem}
                fetchItems={fetchItems}
            />
            <MessageModal
                show={showMessageInputModal}
                handleClose={handleCloseMessageModal}
                existingItem={existingItem}
                fetchItems={fetchItems}
            />
            <LostAndFoundViewModal
                showModal={showViewModal}
                setShowModal={setShowViewModal}
                selectedItem={selectedItem}
                fetchItems={fetchItems}
                claimData={claimData}
            />
            {/* <LostAndFoundViewModal
                show={showViewModal}
                handleClose={() => setShowViewModal(false)}
                item={selectedItem}
                claimData={claimData}
            /> */}
        </div>
    );
}

export default AdminLostAndFound;
