import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Button, Container, Form, Pagination, FormControl, Modal } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MessageModal from "../Messages/components/MessageModal";
import LostAndFoundViewModal from "./components/LostAndFoundViewModal";
import ClaimListModal from "./components/ClaimListModal";
import formatDate from "../../functions/DateFormat";
function LostAndFoundDashboard() {
    const [items, setItems] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [matches, setMatches] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showMessageInputModal, setShowMessageInputModal] = useState(false);
    const [existingItem, setExistingItem] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [claimData, setClaimData] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get(`${import.meta.env.VITE_GET_LOST_AND_FOUND_CLAIMS_RECORDS}`)
            .then((response) => {
                if (response.data.success) {
                    setItems(response.data.claimed); // Use claimed items for the table
                    setChartData(
                        response.data.chart.map(entry => ({
                            type: entry.type.toUpperCase(),
                            count: entry.count
                        }))
                    );
                    findMatches(response.data.claimed);
                }
            })
            .catch((error) => {
                console.error("Error fetching analytics data:", error);
            });
    };
    

    const processChartData = (data) => {
        const summary = data.reduce((acc, item) => {
            acc[item.type.toUpperCase()] = (acc[item.type.toUpperCase()] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.keys(summary).map(key => ({
            type: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            count: summary[key]
        }));
        setChartData(formattedData);
    };

    const findMatches = (data) => {
        const lostItems = data.filter(item => item.type.toLowerCase() === "lost");
        const foundItems = data.filter(item => item.type.toLowerCase() === "found");

        const potentialMatches = [];
        lostItems.forEach(lost => {
            foundItems.forEach(found => {
                if (lost.item_name.toLowerCase().includes(found.item_name.toLowerCase()) || lost.location === found.location ||
                    lost.description.toLowerCase().includes(found.description.toLowerCase())) {
                    potentialMatches.push({ lost, found });
                }
            });
        });
        setMatches(potentialMatches);
    };

    const handleMessage = (item) => {
        setExistingItem(item);
        setShowMessageInputModal(true);
    };

    const handleCloseMessageModal = () => {
        setShowMessageInputModal(false);
    };

    const filteredItems = items.filter(item =>
        (searchTerm === "" || item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === "" || item.category === categoryFilter) && (typeFilter === "" || item.type.toLowerCase() === typeFilter.toLowerCase())
    );

    const handleViewDetails = (item) => {
        handleResolveClick(item);
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handleResolveClick = async (item) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_GET_CLAIM_DETAILS}`);
            setClaimData(res.data.claims); // Ensure your API returns { claims: [...] }
            // setShowClaimModal(true);
        } catch (error) {
            console.error("Failed to fetch claims:", error);
        }
    };

    return (
        <Container fluid className="mt-1">
            {/* <h1 className="mb-4">Lost & Found Admin Dashboard</h1> */}
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
                                    <p className="mb-0">Lost and found items on campus</p>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Lost & Found Summary</Card.Title>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="type" tick={{ fontSize: 16, fontWeight: 'bold' }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>

            <Form className="mb-3 d-flex gap-3">
                <Form.Control
                    type="text"
                    placeholder="Search by item name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {[...new Set(items.map(item => item.category))].map(category => (
                        <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                </Form.Select>

                {/* New Filter for Lost/Found */}
                <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                </Form.Select>
            </Form>

            <Card>
                <Card.Header className="bg-success text-white">
                    <strong>Lost and Found Claimed List</strong>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover bordered className="shadow-sm">
                        <thead className="table-success">
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Reported By</th>
                                <th>Claimed By</th>
                                <th>Date Claimed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map((item) => (
                                <tr key={item.item_id}>
                                    <td>{item.item_id}</td>
                                    <td>{item.item_name}</td>
                                    <td>{item.type.toUpperCase()}</td>
                                    <td>{item.user_name}</td>
                                    <td>{item.claimer_name}</td>
                                    <td>{formatDate(item.claim_date)}</td>
                                    <td className="d-flex flex-column gap-1">

                                        <Button variant="primary rounded-0 position-relative" size="sm" onClick={() => handleViewDetails(item)}>View Details
                                            {item.claim_count > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {item.claim_count}
                                                </span>
                                            )}
                                        </Button>
                                        {/* <Button variant="success rounded-0" size="sm" onClick={() => handleMessage(item)}>
                                            Message
                                        </Button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Card.Body>
                {filteredItems.length > itemsPerPage && (
    <Card.Footer className="bg-light d-flex justify-content-between align-items-center">
        <div className="ms-2 text-muted">
            Page {currentPage} of {totalPages}
        </div>
        <Pagination className="mb-0">
            <Pagination.Prev
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    </Card.Footer>
)}

            </Card>
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

            {/* <ClaimListModal
                show={showClaimModal}
                onHide={() => setShowClaimModal(false)}
                claimData={claimData}
            /> */}


        </Container>
    );
}

export default LostAndFoundDashboard;
