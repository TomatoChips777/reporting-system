import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Badge } from "react-bootstrap";
import { FaFileAlt, FaTasks, FaPlusCircle, FaSearch, FaWrench, FaBoxOpen } from 'react-icons/fa';
import { io } from 'socket.io-client';

import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useAuth } from "../../../../AuthContext";
import CreateModal from "../components/CreateModal";
import UpdateModal from "../components/UpdateModal";
function ReportScreen() {
    const { role, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [viewType, setViewType] = useState("table");
    const [existingReport, setExistingReport] = useState(null);
    useEffect(() => {
        const fetchReports = async () => {
            // setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/unified-reports/user-reports/${user.id}`);
                setReports(response.data.reports || []);
            } catch (error) {
                alert("Error: Failed to fetch reports.");
            }
        };
        fetchReports();

        const socket = io('http://localhost:5000');
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
            return (
                (report.description.toLowerCase().includes(search) ||
                    report.location.toLowerCase().includes(search) ||
                    report.title.toLowerCase().includes(search)) &&
                (statusFilter === "all" || report.status === statusFilter)
            );
        });
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
        // Ensure the report type is properly set
        const formattedReport = {
            ...report,
            user_id: report.user_id,
            type: report.type || report.report_type, // Ensure type is set from either field
            report_type: report.report_type,
            description: report.description || '',
            location: report.location || '',
            contact_info: report.contact_info || user?.phone || '',
            is_anonymous: Boolean(report.is_anonymous),
            image_path: report.image_path || null,
            status: report.status || 'pending',
            // Maintenance specific fields
            issue_type: report.issue_type || '',
            // Lost and found specific fields
            item_name: report.item_name || report.title || '', // Use title as fallback
            category: report.category || ''
        };

        setExistingReport(formattedReport);
        setShowUpdateModal(true);
    };


    const handleDelete = async (report) =>{
        const reportType = report.report_type;
        // console.log(reportType);
        if(reportType === 'maintenance'){
        const response = await axios.put(`http://localhost:5000/api/unified-reports/reports/archive-maintenance-report/${report.id}`);
        if (response.data.success) {
            alert("Report deleted successfully.");
            // setShowDeleteModal(false);
            // fetchReports();
        }
        }else if(reportType === 'lost' || reportType === 'found'){
            const response = await axios.put(`http://localhost:5000/api/unified-reports/reports/archive-lost-found-report/${report.id}`);

            if (response.data.success) {
                alert("Report deleted successfully.");
                // setShowDeleteModal(false);
                // fetchReports();
            }
        }
       
    }
    const handleOpenCreateModal = () => {
        setExistingReport(null);
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setExistingReport(null);
        setShowCreateModal(false);
    };

    const handleOpenUpdateModal = () => {
        setExistingReport(null);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setExistingReport(null);
        setShowUpdateModal(false);
    };
    // Pagination Logic
    const indexOfLastReport = currentPage * pageSize;
    const indexOfFirstReport = indexOfLastReport - pageSize;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    // Count all reports
    const totalReports = reports.length;

    // Maintenance reports breakdown
    const maintenanceReports = reports.filter(r => r.report_type === 'maintenance');
    const maintenancePending = maintenanceReports.filter(r => r.status === 'pending').length;
    const maintenanceInProgress = maintenanceReports.filter(r => r.status === 'in_progress').length;
    const maintenanceResolved = maintenanceReports.filter(r => r.status === 'resolved').length;

    // Lost & Found reports breakdown
    const lostFoundReports = reports.filter(r => r.report_type === 'lost' || r.report_type === 'found');
    const lostFoundOpen = lostFoundReports.filter(r => r.status === 'open').length;
    const lostFoundClosed = lostFoundReports.filter(r => r.status === 'closed').length;
    const lostFoundClaimed = lostFoundReports.filter(r => r.status === 'claimed').length;

    return (
        <div className="container">
            <div className="row mb-3">
                {/* Total Reports */}
                <div className="col-md-3">
                    <Card className="p-3 text-center shadow-sm">
                        <FaFileAlt className="text-success mb-2" size={30} />
                        <h6>Total Reports</h6>
                        <strong className="fs-1">{totalReports}</strong>
                        <div className="mt-2">
                            <small>Maintenance: {maintenanceReports.length}</small> |{" "}
                            <small>Lost: {reports.filter(r => r.report_type === 'lost').length}</small> |{" "}
                            <small>Found: {reports.filter(r => r.report_type === 'found').length}</small>
                        </div>
                    </Card>
                </div>


                {/* Maintenance Reports */}
                <div className="col-md-3">
                    <Card className="p-3 text-center shadow-sm">
                        <FaWrench className="text-warning mb-2" size={30} />
                        <h6>Maintenance Reports</h6>
                        <strong className="fs-1">{maintenanceReports.length}</strong>
                        <div className="mt-2">
                            <small>Pending: {maintenancePending}</small> |{" "}
                            <small>In Progress: {maintenanceInProgress}</small> |{" "}
                            <small>Resolved: {maintenanceResolved}</small>
                        </div>
                    </Card>
                </div>

                {/* Lost & Found Reports */}
                <div className="col-md-3">
                    <Card className="p-3 text-center shadow-sm">
                        <FaBoxOpen className="text-primary mb-2" size={30} />
                        <h6>Lost & Found</h6>
                        <strong className="fs-1">{lostFoundReports.length}</strong>
                        <div className="mt-2">
                            <small>Open: {lostFoundOpen}</small> |{" "}
                            <small>Closed: {lostFoundClosed}</small> |{" "}
                            <small>Claimed: {lostFoundClaimed}</small>
                        </div>
                    </Card>
                </div>

                {/* Other Reports (New Fourth Card) */}
                <div className="col-md-3">
                    <Card className="p-3 text-center shadow-sm">
                        <FaTasks className="text-info mb-2" size={30} />
                        <h6>Other Reports</h6>
                        <strong className="fs-1">
                            {reports.filter(r => !['maintenance', 'lost', 'found'].includes(r.report_type)).length}
                        </strong>
                        <div className="mt-2">
                            <small>Miscellaneous: {reports.filter(r => !['maintenance', 'lost', 'found'].includes(r.report_type)).length}</small>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Reports</h2>
                <button className="btn btn-success rounded-0" onClick={() => handleOpenCreateModal()}>
                    <FaPlusCircle className="me-1" /> Create Report
                </button>
            </div>

            {/* Reports Table */}
            <Card className="border-0 shadow-sm" >
                <Card.Header className="bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <h5 className="mb-0">All Reports</h5>
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
                                <option value="list">Table View</option>
                                <option value="list">List View</option>
                            </Form.Select>
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
                <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <div className="table-responsive">
                        {viewType === "list" ? (
                            <ul className="list-group">
                                {currentReports.map((report) => (
                                    // <ReportItem key={report.unique_id} item={report} />
                                    <li key={report.unique_id} className="list-group-item mb-3">
                                        <div className="d-flex align-items-start justify-content-between">
                                            {/* Left Side: Report Details */}
                                            <div className="w-75 me-3">
                                                <p><strong>Date:</strong> {new Date(report.date_reported).toLocaleString('en-US', {
                                                    timeZone: 'Asia/Manila',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}</p>
                                                <p><strong>Type:</strong> {report.report_type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                                                <p><strong>Title:</strong> {report.title}</p> {/* Use `title` instead of `issue_type` */}

                                                <p><strong>Description:</strong> {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}</p>
                                                <p>
                                                    <strong>Status:</strong>
                                                    <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2 rounded-0">
                                                        {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </Badge>
                                                </p>
                                                <Button variant="outline-primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="outline-danger rounded-0" size="sm" onClick={() => handleDelete(report)}>Remove</Button>
                                            </div>

                                            {/* Right Side: Image */}
                                            <div className="w-25">
                                                <img
                                                    src={`http://localhost:5000/uploads/${report.image_path}` || "https://via.placeholder.com/150"}
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
                                        <th>Location</th>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th style={{ width: "16%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReports.map((report) => (
                                        <tr key={report.unique_id}>
                                            <td>{new Date(report.date_reported).toLocaleString('en-US', {
                                                timeZone: 'Asia/Manila',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}</td>
                                            <td>{report.location}</td>
                                            <td>{report.title}</td>
                                            <td>{report.report_type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                                            <td>
                                                {report.description.length > 20
                                                    ? report.description.substring(0, 20) + "..."
                                                    : report.description}
                                            </td>
                                            <td>
                                                <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="rounded-0">
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button variant="outline-primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="outline-danger rounded-0" size="sm" onClick={() => handleDelete(report)}>Remove</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Card.Body>
                <Card.Footer>
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
                </Card.Footer>
            </Card>

            <CreateModal
                show={showCreateModal}
                handleClose={handleCloseCreateModal}
                existingReport={existingReport}
                defaultType="maintenance"
            />
            <UpdateModal
                show={showUpdateModal}
                handleClose={handleCloseUpdateModal}
                existingReport={existingReport}
            />

        </div>
    );
}

export default ReportScreen;
