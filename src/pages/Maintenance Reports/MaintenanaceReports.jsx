import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Badge, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaSearch, FaArrowDown, FaEquals, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';
import { io } from 'socket.io-client';
import MessageModal from "../Messages/components/MessageModal";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useAuth } from "../../../AuthContext";
function Reports() {
    const { role, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [viewType, setViewType] = useState("table");
    const [monthFilter, setMonthFilter] = useState(""); // Month filter state
    const [yearFilter, setYearFilter] = useState("");   // Year filter state
    const [dayFilter, setDayFilter] = useState(""); // Day filter state
    const [priorityFilter, setPriorityFilter] = useState("all");

    const [showMessageInputModal, setShowMessageInputModal] = useState(false);
    const [existingItem, setExistingItem] = useState(null);
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_MAINTENANCE_REPORT}`);
            setReports(response.data.reports || []);
            setFilteredReports(response.data.reports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setReports([]);
            setFilteredReports([]);
        }
    };
    useEffect(() => {

        fetchReports();

        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on('update', () => {

            fetchReports();
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    useEffect(() => {
        let updatedReports = reports.filter(report => {
            const search = searchTerm.toLowerCase();
            const reportDate = new Date(report.created_at);
            const selectedMonth = parseInt(monthFilter, 10);
            const selectedYear = parseInt(yearFilter, 10);
            const selectedDay = parseInt(dayFilter, 10);

            return (
                (report.description.toLowerCase().includes(search) ||
                    report.reporter_name.toLowerCase().includes(search) ||
                    report.location.toLowerCase().includes(search))
                &&
                (statusFilter === "all" || report.status === statusFilter)
                &&
                (priorityFilter === "all" || report.priority === priorityFilter)
                &&
                (monthFilter === "" || reportDate.getMonth() + 1 === selectedMonth)
                &&
                (yearFilter === "" || reportDate.getFullYear() === selectedYear)
                &&
                (dayFilter === "" || reportDate.getDate() === selectedDay)
            );
        });

        setFilteredReports(updatedReports);
    }, [searchTerm, monthFilter, yearFilter, dayFilter, reports, statusFilter, priorityFilter]);


    const uniqueYears = [...new Set(reports.map(report => new Date(report.created_at).getFullYear()))].sort((a, b) => b - a);


    const handleMessage = (item) => {
        setExistingItem(item);
        setShowMessageInputModal(true);
    }
    const handleCloseMessageModal = () => {
        setShowMessageInputModal(false);
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1);
    };


    const handleViewDetails = (report) => {
        setSelectedReport({ ...report });
        setShowModal(true);
    };

    const handleStatusChange = (e) => {
        setSelectedReport((prev) => ({ ...prev, status: e.target.value }));
    };

    const handleUpdateStatus = async () => {
        if (!selectedReport || !selectedReport.status) {
            console.error("Invalid report selection or missing status.");
            return;
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_MAINTENANCE_REPORT_UPDATE_STATUS}/${selectedReport.id}`,
                { status: selectedReport.status },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.id === selectedReport.id ? { ...report, status: selectedReport.status } : report
                    )
                );
                setShowModal(false);
            } else {
                alert("Failed to update report status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update report status. Please try again.");
        }
    };

    const handleRemoval = async () => {
        if (!reportToDelete) {
            console.error("Invalid report selection.");
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_MAINTENANCE_REMOVE_REPORTS}/${reportToDelete}`);

            if (response.data.success) {
                setReports((prevReports) => prevReports.filter((report) => report.id !== reportToDelete));
                setShowDeleteModal(false);
                setReportToDelete(null);
            } else {
                alert("Failed to delete report.");
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Failed to delete report. Please try again.");
        }
    }
    const confirmRemoval = (reportID) => {
        setReportToDelete(reportID);
        setShowDeleteModal(true);
    };
    // Pagination Logic
    const indexOfLastReport = currentPage * pageSize;
    const indexOfFirstReport = indexOfLastReport - pageSize;
    const currentReports = Array.isArray(filteredReports) ? filteredReports.slice(indexOfFirstReport, indexOfLastReport) : [];

    const totalReports = reports.length;
    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;

    const lowCount = reports.filter(r => r.priority === 'Low').length;
    const mediumCount = reports.filter(r => r.priority === 'Medium').length;
    const highCount = reports.filter(r => r.priority === 'High').length;
    const urgentCount = reports.filter(r => r.priority === 'Urgent').length;
    return (
        <div className="container-fluid">
            <div className="row mb-2">
                <div className="col-12">
                    <div className="card bg-success text-white">
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <i className="bi bi-exclamation-triangle-fill display-4"></i>
                                </div>
                                <div className="col">
                                    <h5 className="mb-0">Maintenance Reports</h5>
                                </div>
                                <div className="col-auto d-flex align-items-center ">
                                    {/* Search Bar: Make it take more space */}
                                    <div className="input-group" style={{ maxWidth: "auto" }}>
                                        <Form.Control
                                            type="text"
                                            className="rounded-0"
                                            placeholder="Search reports..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                        <span className="input-group-text rounded-0">
                                            <FaSearch />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <Form.Select
                                        value={viewType}
                                        onChange={(e) => setViewType(e.target.value)}
                                        className="me-2 rounded-0"
                                    >
                                        <option value="table">Table View</option>
                                        <option value="list">List View</option>
                                    </Form.Select>
                                </div>
                                <div className="col-auto">
                                    <Form.Select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className="me-2 rounded-0">
                                        <option value="">Filter by Day</option>
                                        {[...Array(31)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <div className="col-auto">
                                    <Form.Select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="me-2 rounded-0">
                                        <option value="">Filter by Months</option>
                                        {[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ].map((month, index) => (
                                            <option key={index + 1} value={index + 1}>{month}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <div className="col-auto">
                                    <Form.Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="me-2 rounded-0">
                                        <option value="">Filter by Years</option>
                                        {uniqueYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${statusFilter === "all" ? "border border-primary bg-light" : ""}`}
                        onClick={() => handleFilterChange("all")}
                        style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                        <FaFileAlt className="text-success mb-1" size={20} />
                        <h6 className="mb-0">All</h6>
                        <strong className='fs-5'>{totalReports}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${statusFilter === "pending" ? "border border-primary bg-light" : ""}`}
                        onClick={() => handleFilterChange("pending")}
                        style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                        <FaClock className="text-warning mb-1" size={20} />
                        <h6 className="mb-0">Pending</h6>
                        <strong className='fs-5'>{pendingCount}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${statusFilter === "in_progress" ? "border border-primary bg-light" : ""}`}
                        onClick={() => handleFilterChange("in_progress")}
                        style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                        <FaTasks className="text-primary mb-1" size={20} />
                        <h6 className="mb-0">In Progress</h6>
                        <strong className='fs-5'>{inProgressCount}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${statusFilter === "resolved" ? "border border-primary bg-light" : ""}`}
                        onClick={() => handleFilterChange("resolved")}
                        style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                        <FaCheckCircle className="text-success mb-1" size={20} />
                        <h6 className="mb-0">Resolved</h6>
                        <strong className='fs-5'>{resolvedCount}</strong>
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${priorityFilter === "Low" ? "border border-primary bg-light" : ""}`}
                        onClick={() => setPriorityFilter(priorityFilter === "Low" ? "all" : "Low")}
                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                    >
                        <FaArrowDown className="text-success mb-1" size={20} />
                        <h6 className="mb-0">Low</h6>
                        <strong className='fs-5'>{lowCount}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${priorityFilter === "Medium" ? "border border-primary bg-light" : ""}`}
                        onClick={() => setPriorityFilter(priorityFilter === "Medium" ? "all" : "Medium")}
                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                    >
                        <FaEquals className="text-primary mb-1" size={20} />
                        <h6 className="mb-0">Medium</h6>
                        <strong className='fs-5'>{mediumCount}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${priorityFilter === "High" ? "border border-primary bg-light" : ""}`}
                        onClick={() => setPriorityFilter(priorityFilter === "High" ? "all" : "High")}
                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                    >
                        <FaArrowUp className="text-warning mb-1" size={20} />
                        <h6 className="mb-0">High</h6>
                        <strong className='fs-5'>{highCount}</strong>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div
                        className={`card p-2 text-center rounded-1 ${priorityFilter === "Urgent" ? "border border-primary bg-light" : ""}`}
                        onClick={() => setPriorityFilter(priorityFilter === "Urgent" ? "all" : "Urgent")}
                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                    >
                        <FaExclamationTriangle className="text-danger mb-1" size={20} />
                        <h6 className="mb-0">Urgent</h6>
                        <strong className='fs-5'>{urgentCount}</strong>
                    </div>
                </div>
            </div>



            {/* Reports Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white py-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <h5 className="mb-0">Maintenanace Reports</h5>
                        </div>
                        <div className="col-auto">
                            <div className="btn-group ">
                                {["all", "pending", "in_progress", "resolved"].map((status) => (
                                    <Button key={status} variant="outline-dark" className={statusFilter === status ? "active rounded-0" : "rounded-0"} onClick={() => handleFilterChange(status)}>
                                        {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
                                        {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}

                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-0 mb-0">
                    <div className="table-responsive">
                        {viewType === "list" ? (
                            <ul className="list-group">
                                {currentReports.map((report) => (
                                    <li key={report.id} className="list-group-item rounded-0">
                                        <div className="d-flex align-items-start justify-content-between">
                                            {/* Left Side: Report Details */}
                                            <div className="w-75 me-3">
                                                <p><strong>Date Reported:</strong> {new Date(report.created_at).toLocaleString('en-US', {
                                                    timeZone: 'Asia/Manila',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}</p>
                                                <p><strong>Reported By:</strong> {report.reporter_name}</p>
                                                <p><strong>Location:</strong> {report.location}</p>
                                                <p><strong>Issue Type:</strong> {report.maintenance_category.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                                                <p><strong>Description:</strong> {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}</p>

                                                <p>
                                                    <strong>Priority: </strong>
                                                    {/* <Badge
                                                        bg={
                                                            report.priority === "Low" ? "success" :
                                                                report.priority === "Medium" ? "primary" :
                                                                    report.priority === "High" ? "warning" :
                                                                        report.priority === "Urgent" ? "danger" : "secondary"
                                                        }
                                                        className="ms-2 rounded-0"
                                                    > */}
                                                    {report.priority}
                                                    {/* </Badge> */}
                                                </p>

                                                <p>
                                                    <strong>Status: </strong>
                                                    {/* <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2 rounded-0"> */}
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    {/* </Badge> */}
                                                </p>
                                                <div className="d-flex justify-content-end align-items-end">
                                                    <Button variant="primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                    <Button variant="danger rounded-0" size="sm" onClick={() => confirmRemoval(report.id)}>Remove</Button>
                                                    <Button variant="success rounded-0" size="sm" className="ms-2" onClick={() => handleMessage(report)} disabled={user.id === report.user_id || report.status === 'resolved'}>
                                                        Message
                                                    </Button>
                                                </div>

                                            </div>

                                            {/* Right Side: Image */}
                                            <div className="w-25">
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGES}/${report.image_path}` || "https://via.placeholder.com/150"}
                                                    alt="No image attached"
                                                    className="img-thumbnail rounded shadow-sm"
                                                    style={{ height: '290px' }}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Table hover bordered className="shadow-sm mb-0">
                                <thead className="table-success">
                                    <tr>
                                        <th>Date Reported</th>
                                        <th>Reported By</th>
                                        <th>Location</th>
                                        <th>Issue Type</th>
                                        <th>Description</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th className="text-center align-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReports.map((report) => (
                                        <tr key={report.id}>
                                            <td>{new Date(report.created_at).toLocaleString('en-US', {
                                                timeZone: 'Asia/Manila',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}</td>
                                            <td>{report.reporter_name}</td>
                                            <td>{report.location}</td>
                                            <td>{report.maintenance_category.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                                            <td>
                                                {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}
                                            </td>
                                            <td>
                                                {report.priority}
                                            </td>
                                            <td>
                                                {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </td>
                                            <td className="d-flex justify-content-center">
                                                <Button variant="primary rounded-0 me-2" size="sm" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="danger rounded-0" size="sm" onClick={() => confirmRemoval(report.id)}>Remove</Button>
                                                <Button variant="success rounded-0 ms-2" size="sm" onClick={() => handleMessage(report)} disabled={user.id === report.user_id || report.status === 'resolved'}>
                                                    Message
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        )}
                    </div>
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to remove this report? This action cannot be undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" className="rounded-0" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="danger" className="rounded-0" onClick={handleRemoval}>Remove</Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
                <Card.Footer>
                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                        <div className="d-flex align-items-center">
                            <Form.Select value={pageSize} onChange={handlePageSizeChange} className="me-2 rounded-0">
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="30">35 per page</option>
                                <option value="40">40 per page</option>
                                <option value="50">50 per page</option>
                            </Form.Select>
                            <span>{filteredReports.length} records</span>
                        </div>
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0 d-flex flex-wrap overflow-auto">
                                {/* Previous Button */}
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link rounded-0"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                </li>

                                {/* Page Numbers */}
                                {Array.from({ length: Math.ceil(filteredReports.length / pageSize) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? "active" : ""}`}>
                                            <Button
                                                variant="link"
                                                className="page-link rounded-0"
                                                onClick={() => setCurrentPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </Button>
                                        </li>
                                    );
                                })}

                                {/* Next Button */}
                                <li className={`page-item ${currentPage === Math.ceil(filteredReports.length / pageSize) ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link rounded-0"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredReports.length / pageSize)}
                                    >
                                        Next
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </Card.Footer>
            </Card>
            {/* View Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Report Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport ? (
                        <div>
                            <p className="text-break"><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleString('en-US', {
                                timeZone: 'Asia/Manila',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}</p>
                            <p className="text-break"><strong>Reported By:</strong> {selectedReport.reporter_name}</p>
                            <p className="text-break"><strong>Location:</strong> {selectedReport.location}</p>
                            <p className="text-break"><strong>Issue Type:</strong> {selectedReport.maintenance_category}</p>
                            <p className="text-break"><strong>Description:</strong> {selectedReport.description}</p>
                            {/* Image Display */}
                            {selectedReport.image_path && (
                                <div className="mb-3 d-flex flex-column align-items-center text-center">
                                    <strong>Attached Image:</strong>
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES}/${selectedReport.image_path}`}
                                        alt="Report"
                                        className="img-fluid mt-2"
                                        style={{ maxHeight: "300px", borderRadius: "10px" }}
                                    />
                                </div>
                            )}

                            <Form.Group controlId="statusSelect">
                                <Form.Label><strong>Status:</strong></Form.Label>
                                <Form.Select value={selectedReport.status} onChange={handleStatusChange} className="rounded-0">
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    ) : (
                        <p>No details available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="rounded-0" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" className="rounded-0" onClick={handleUpdateStatus}>Update Status</Button>
                </Modal.Footer>
            </Modal>

            <MessageModal
                show={showMessageInputModal}
                handleClose={handleCloseMessageModal}
                existingItem={existingItem}
                fetchItems={fetchReports}
            />
        </div>
    );
}

export default Reports;
