import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Badge, Modal,OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaSearch, FaArrowDown, FaEquals, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';
import { io } from 'socket.io-client';
import MessageModal from "../Messages/components/MessageModal";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useAuth } from "../../../AuthContext";
function Reports() {
    const { role } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [viewType, setViewType] = useState("list");
    const [monthFilter, setMonthFilter] = useState(""); // Month filter state
    const [yearFilter, setYearFilter] = useState("");   // Year filter state
    const [dayFilter, setDayFilter] = useState(""); // Day filter state
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
                (monthFilter === "" || reportDate.getMonth() + 1 === selectedMonth)
                &&
                (yearFilter === "" || reportDate.getFullYear() === selectedYear)
                &&
                (dayFilter === "" || reportDate.getDate() === selectedDay)
            );
        });

        setFilteredReports(updatedReports);
    }, [searchTerm, monthFilter, yearFilter, dayFilter, reports, statusFilter]);



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
            const response = await axios.delete(`${import.meta.env.VITE_MAINTENANCE_REMOVE_REPORTS}/${reportToDelete}`, {
                data: {
                    role: role
                },
            });

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
        <div className="container">
            <div className="row mb-2">
                <div className="col-12">
                    <div className="card bg-success text-white rounded-0">
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
                                        <option value="list">List View</option>
                                        <option value="table">Table View</option>
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
            <div className="row mb-3">
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaFileAlt className="text-success mb-2" size={30} />
                        <h6>Total Reports</h6>
                        <strong className='fs-1'>{totalReports}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaClock className="text-warning mb-2" size={30} />
                        <h6>Pending</h6>
                        <strong className='fs-1'>{pendingCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaTasks className="text-primary mb-2" size={30} />
                        <h6>In Progress</h6>
                        <strong className='fs-1'>{inProgressCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaCheckCircle className="text-success mb-2" size={30} />
                        <h6>Resolved</h6>
                        <strong className='fs-1'>{resolvedCount}</strong>
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaArrowDown className="text-success mb-2" size={30} />
                        <h6>Low Priority</h6>
                        <strong className='fs-4'>{lowCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaEquals className="text-warning mb-2" size={30} />
                        <h6>Medium Priority</h6>
                        <strong className='fs-4'>{mediumCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaArrowUp className="text-danger mb-2" size={30} />
                        <h6>High Priority</h6>
                        <strong className='fs-4'>{highCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center rounded-0">
                        <FaExclamationTriangle className="text-danger mb-2" size={30} />
                        <h6>Urgent Priority</h6>
                        <strong className='fs-4'>{urgentCount}</strong>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3">
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
                <Card.Body>
                    <div className="table-responsive">
                        {viewType === "list" ? (
                            <ul className="list-group">
                                {currentReports.map((report) => (
                                    <li key={report.id} className="list-group-item mb-3">
                                        <div className="d-flex align-items-start justify-content-between">
                                            {/* Left Side: Report Details */}
                                            <div className="w-75 me-3">
                                                <p><strong>Date:</strong> {new Date(report.created_at).toLocaleString('en-US', {
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
                                                    <strong>Priority:</strong>
                                                    <Badge
                                                        bg={
                                                            report.priority === "Low" ? "success" :
                                                                report.priority === "Medium" ? "warning" :
                                                                    report.priority === "High" ? "danger" :
                                                                        report.priority === "Urgent" ? "dark" : "secondary"
                                                        }
                                                        className="ms-2 rounded-0"
                                                    >
                                                        {report.priority}
                                                    </Badge>
                                                </p>

                                                <p>
                                                    <strong>Status:</strong>
                                                    <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2 rounded-0">
                                                        {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </Badge>
                                                </p>
                                                <Button variant="outline-primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="outline-danger rounded-0" size="sm" onClick={() => confirmRemoval(report.id)}>Remove</Button>
                                                <Button variant="outline-warning rounded-0" size="sm" className="ms-2" onClick={() => handleMessage(report)}>
                                                    Message
                                                </Button>
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
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Reported By</th>
                                        <th>Location</th>
                                        <th>Issue Type</th>
                                        <th>Description</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th style={{ width: "16%" }}>Actions</th>
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
                                            <p>
                                                <Badge
                                                    bg={
                                                        report.priority === "Low" ? "success" :
                                                            report.priority === "Medium" ? "warning" :
                                                                report.priority === "High" ? "danger" :
                                                                    report.priority === "Urgent" ? "dark" : "secondary"
                                                    }
                                                    className="ms-2 rounded-0"
                                                >
                                                    {report.priority}
                                                </Badge>
                                            </p>
                                            <td>
                                                <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="rounded-0">
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button variant="outline-primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="outline-danger rounded-0" size="sm" onClick={() => confirmRemoval(report.id)}>Remove</Button>
                                                <Button variant="outline-warning rounded-0" size="sm" className="ms-2" onClick={() => handleMessage(report)}>
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

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                        <div className="d-flex align-items-center">
                            <Form.Select value={pageSize} onChange={handlePageSizeChange} className="me-2 rounded-0">
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
                                <option value="15">15 per page</option>
                                <option value="20">20 per page</option>
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
                </Card.Body>
            </Card>
            {/* View Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
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
