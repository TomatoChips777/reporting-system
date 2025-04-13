import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Badge, Modal } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useAuth } from "../AuthContext";
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
    const [viewType, setViewType] = useState("table");


    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/reports");
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);


    useEffect(() => {
        let updatedReports = reports.filter(report =>
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "all" || report.status === statusFilter)
        );
        setFilteredReports(updatedReports);
    }, [searchTerm, statusFilter, reports]);

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
                `http://localhost:5000/api/reports/admin/edit/${selectedReport.id}`,
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

    const handleDelete = async () => {
        if (!reportToDelete) {
            console.error("Invalid report selection.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/api/reports/admin/report/${reportToDelete}`, {
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
    const confirmDelete = (reportID) => {
        setReportToDelete(reportID);
        setShowDeleteModal(true);
    };
    // Pagination Logic
    const indexOfLastReport = currentPage * pageSize;
    const indexOfFirstReport = indexOfLastReport - pageSize;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Reports</h1>

            {/* Report Summary Cards */}
            <div className="row mb-4">
                {["Pending", "In Progress", "Resolved"].map((status, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex align-items-center">
                                {/* <div className="me-3 p-3 rounded bg-opacity-10" style={{ backgroundColor: status === "Pending" ? "#ffc107" : status === "In Progress" ? "#007bff" : "#28a745" }}> */}
                                <div
                                    className="me-3 p-3 rounded"
                                    style={{
                                        backgroundColor: status === "Pending" ? "rgba(255, 193, 7, 0.2)"  // Yellow with 20% opacity
                                            : status === "In Progress" ? "rgba(0, 123, 255, 0.2)" // Blue with 20% opacity
                                                : "rgba(40, 167, 69, 0.2)" // Green with 20% opacity
                                    }}
                                >

                                    <i className={`bi ${status === "Pending" ? "bi-exclamation-circle text-warning" : status === "In Progress" ? "bi-gear text-primary" : "bi-check-circle text-success"} fs-4`} />
                                </div>
                                <div>
                                    <h6 className="mb-1">{status}</h6>
                                    <h3 className="mb-0">
                                        {/* {reports.filter(r => r.status.toLowerCase() === status.toLowerCase()).length} */}
                                        {reports.filter(r => r.status === status.toLowerCase().replace(" ", "_")).length}

                                    </h3>

                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Reports Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <h5 className="mb-0">All Reports</h5>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Form.Select value={viewType} onChange={(e) => setViewType(e.target.value)} className="me-2">
                                <option value="table">Table View</option>
                                <option value="list">List View</option>
                            </Form.Select>
                            <Form.Control type="text" placeholder="Search reports..." value={searchTerm} onChange={handleSearch} />
                        </div>

                        {/* <div className="col-auto">
                            <Form.Control type="text" placeholder="Search reports..." value={searchTerm} onChange={handleSearch} />
                        </div> */}
                        <div className="col-auto">
                            <div className="btn-group">
                                {["all", "pending", "in_progress", "resolved"].map((status) => (
                                    <Button key={status} variant="outline-dark" className={statusFilter === status ? "active" : ""} onClick={() => handleFilterChange(status)}>
                                        {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
                                        {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}

                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {viewType === "table" ? (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Reported By</th>
                                        <th>Location</th>
                                        <th>Issue Type</th>
                                        <th>Description</th>
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
                                            <td>{report.issue_type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                                            <td>
                                                {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}
                                            </td>
                                            <td>
                                                <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"}>
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(report.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <ul className="list-group">
                            {currentReports.map((report) => (
                                <li key={report.id} className="list-group-item mb-3">
                                    <h5>{report.issue_type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h5>
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
                                    <p><strong>Description:</strong> {report.description}</p>
                                    <p>
                                        <strong>Status:</strong>
                                        <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2">
                                            {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </Badge>
                                    </p>
                                    <div>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(report.id)}>Delete</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    )}

                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this report? This action cannot be undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center">
                            <Form.Select value={pageSize} onChange={handlePageSizeChange} className="me-2">
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
                                <option value="15">15 per page</option>
                                <option value="20">20 per page</option>
                            </Form.Select>
                            <span>{filteredReports.length} records</span>
                        </div>
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0">
                                {/* Previous Button */}
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                </li>

                                {/* Page Numbers */}
                                {Array.from({ length: Math.ceil(filteredReports.length / pageSize) }, (_, i) => (
                                    <li key={i} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                                        <Button
                                            variant="link"
                                            className="page-link"
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    </li>
                                ))}

                                {/* Next Button */}
                                <li className={`page-item ${currentPage === Math.ceil(filteredReports.length / pageSize) ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link"
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Report Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport ? (
                        <div>
                            <p><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleString('en-US', {
                                timeZone: 'Asia/Manila',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}</p>
                            <p><strong>Reported By:</strong> {selectedReport.reporter_name}</p>
                            <p><strong>Location:</strong> {selectedReport.location}</p>
                            <p><strong>Issue Type:</strong> {selectedReport.issue_type}</p>
                            <p><strong>Description:</strong> {selectedReport.description}</p>
                            {/* Image Display */}
                            {selectedReport.image_path && (
                                <div className="mb-3">
                                    <strong>Attached Image:</strong>
                                    <img
                                        src={`http://localhost:5000/uploads/${selectedReport.image_path}`}
                                        alt="Report"
                                        className="img-fluid mt-2"
                                        style={{ maxHeight: "300px", borderRadius: "10px" }}
                                    />
                                </div>
                            )}
                            <Form.Group controlId="statusSelect">
                                <Form.Label><strong>Status:</strong></Form.Label>
                                <Form.Select value={selectedReport.status} onChange={handleStatusChange}>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>Update Status</Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

export default Reports;
