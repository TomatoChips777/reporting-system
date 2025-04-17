import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Badge, Modal } from "react-bootstrap";
import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaChevronRight, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { io } from 'socket.io-client';
import ViewReportModal from "./Components/ViewReportModal";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useAuth } from "../../../AuthContext";
import MessageModal from "../Messages/components/MessageModal";
import formatDate from "../../functions/DateFormat";
import CreateReport from "./Components/CreateReport";
import FloatingChat from "../../components/FloatingChat";
function Reports() {
    const { role } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
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

    const [showMessageInputModal, setShowMessageInputModal] = useState(false);
    const [existingItem, setExistingItem] = useState(null);
    const [showCreateModal, setCreateShowModal] = useState(false);


    const handleOpenModal = () => {
        setCreateShowModal(true);
    };
    const handleClose = () => {
        setCreateShowModal(false);
    }
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_REPORTS}`);
            setReports(response.data);
            setFilteredReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
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
                    report.location.toLowerCase().includes(search)) &&
                (monthFilter === "" || reportDate.getMonth() + 1 === selectedMonth) &&
                (yearFilter === "" || reportDate.getFullYear() === selectedYear)
                &&
                (dayFilter === "" || reportDate.getDate() === selectedDay)
            );
        });

        setFilteredReports(updatedReports);
    }, [searchTerm, monthFilter, yearFilter, dayFilter, reports]);


    const uniqueYears = [...new Set(reports.map(report => new Date(report.created_at).getFullYear()))].sort((a, b) => b - a);

    const handleMessage = (item) => {
        // setExistingItem(item);
        setExistingItem({
            report_id: item.id,
            ...item,
        });

        console.log(item);
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

    const handleReportTypeChange = (e) => {
        console.log(e);
        setSelectedReport((prev) => ({ ...prev, report_type: e.target.value }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedReport((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateStatus = async () => {
        if (!selectedReport || !selectedReport.report_type) {
            console.error("Invalid report selection or missing report type.");
            return;
        }

        try {
            // Send full report data along with report_type
            const response = await axios.put(
                `${import.meta.env.VITE_UPDATE_REPORT_TYPE}/${selectedReport.id}`,
                {
                    report_type: selectedReport.report_type,
                    type: selectedReport.type || "lost",
                    item_name: selectedReport.item_name || "",
                    category: selectedReport.category || "",
                    contact_info: selectedReport.contact_info || "",
                    priority: selectedReport.priority || "",
                    assigned_staff: selectedReport.assigned_staff || "",
                    status: selectedReport.status || "",
                    sender_id: selectedReport.user_id || "",
                    location: selectedReport.location || "",
                    description: selectedReport.description || '',
                    is_anonymous: selectedReport.is_anonymous || 0,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.id === selectedReport.id ? { ...report, ...selectedReport } : report
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
            const response = await axios.put(`${import.meta.env.VITE_REMOVE_REPORT}/${reportToDelete}`, {
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
        <div className="container-fluid">
            <FloatingChat reportType="reports-analytics"/>
            <div className="row mb-2">
                <div className="col-12">
                    <div className="card bg-success text-white">
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <i className="bi bi-exclamation-triangle-fill display-4"></i>
                                </div>
                                <div className="col">
                                    <h5 className="mb-0">Reports</h5>
                                    <p className="mb-0">View and manage reports</p>
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
            {/* Reports Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white py-3 d-flex justify-content-between align-items-center">
                    <strong>Reports List</strong>
                    <Button className="btn btn-light btn-m rounded-0" onClick={() => handleOpenModal()}>
                        <i className="bi bi-plus-lg me-2"></i>Create Report
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        {viewType === "list" ? (
                            <ul className="list-group">
                                {currentReports.map((report) => (
                                    <li key={report.id} className="list-group-item rounded-0">
                                        <div className="d-flex align-items-start justify-content-between">
                                            {/* Left Side: Report Details */}
                                            <div className="w-75 me-3">
                                                <p><strong>Date:</strong> {formatDate(report.created_at)}</p>
                                                <p><strong>Reported By:</strong> {report.reporter_name}</p>
                                                <p><strong>Location:</strong> {report.location}</p>
                                                <p><strong>Description:</strong> {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}</p>
                                                <p>
                                                    <strong>Status:</strong>
                                                    {/* <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2 rounded-0"> */}
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    {/* </Badge> */}
                                                </p>
                                                <Button variant="primary rounded-0" size="sm" className="me-2" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="danger rounded-0" size="sm" onClick={() => confirmDelete(report.id)}>Remove</Button>
                                                <Button variant="success rounded-0" size="sm" className="ms-2" onClick={() => handleMessage(report)}>
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
                            <Table hover responsive bordered className="mb-0">
                                <thead className="table-success striped">
                                    <tr>
                                        <th>Date</th>
                                        <th>Reported By</th>
                                        <th>Location</th>
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
                                            <td>
                                                {report.description.length > 50
                                                    ? report.description.substring(0, 50) + "..."
                                                    : report.description}
                                            </td>
                                            <td>
                                                {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </td>
                                            <td className="d-flex justify-content-center">
                                                <Button variant="primary rounded-0 me-2" size="sm" onClick={() => handleViewDetails(report)}>View</Button>
                                                <Button variant="danger rounded-0" size="sm" onClick={() => confirmDelete(report.id)}>Remove</Button>
                                                <Button variant="success rounded-0 ms-2" size="sm" onClick={() => handleMessage(report)}>
                                                    Message
                                                </Button>
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
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="30">30 per page</option>
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

            <ViewReportModal
                show={showModal}
                onHide={() => setShowModal(false)}
                report={selectedReport}
                onUpdateType={handleReportTypeChange}
                onUpdateStatus={handleUpdateStatus}
                onChange={handleChange}
            />
            <MessageModal
                show={showMessageInputModal}
                handleClose={handleCloseMessageModal}
                existingItem={existingItem}
                fetchItems={fetchReports}
            />

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Remove</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this report? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="rounded-0" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" className="rounded-0" onClick={handleDelete}>Remove</Button>
                </Modal.Footer>
            </Modal>


            <CreateReport
                show={showCreateModal}
                handleClose={handleClose}
            />
        </div>
    );
}

export default Reports;
