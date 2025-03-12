import { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthContext';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaChevronRight, FaPlusCircle, FaSearch } from 'react-icons/fa';
import ReportModal from '../components/CreateReportModal';
import { io } from 'socket.io-client';

const ReportScreen = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 5;
    const [itemsPerPage, setItemsPerPage] = useState(5);  // Make this state dynamic


    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [existingReport, setExistingReport] = useState(null); // If editing an existing report

    const [socket, setSocket] = useState(null);  // WebSocket state
    const handleOpenModal = (report = null) => {    
        setExistingReport(report);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        fetchReports();

        // Initialize socket connection for real-time updates
        const socket = io('http://localhost:5000');
        setSocket(socket);
        
        socket.on('createdReport', (newReport)=>{

            setReports((prevReports) => [newReport, ...prevReports]);

        });
        
        socket.on('updatedStatus', (data) => {
            setReports((prevReports) =>
                prevReports.map((report) =>
                    report.id === Number(data.reportId) ? { ...report, status: data.status } : report
                )
            );
                   
        });

        socket.on('reportDeleted', (data) => {
            setReports((prevReports) =>
                prevReports.filter((report) => report.id !== Number(data.reportId))
            );
        });
        

        // Cleanup socket connection when the component is unmounted
        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchReports = async () => {

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/reports/user/${user.id}`);
            setReports(response.data.reports || []);

        } catch (error) {
            alert("Error: Failed to fetch reports.");
        }
        setLoading(false);
    };

    const totalReports = reports.length;
    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;

    const filteredReports = reports.filter(r => {
        const matchesStatus = selectedStatus ? r.status === selectedStatus : true;
        const matchesSearch = searchQuery ? r.issue_type.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesStatus && matchesSearch;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const formatStatus = (status) => status === 'in_progress' ? 'In Progress' : capitalizeFirstLetter(status);

    const handleStatusFilter = (status) => {
        setSelectedStatus(status === selectedStatus ? null : status);
        setCurrentPage(1);
    };
    const ReportItem = memo(({ item }) => (
        <div
            className="list-group-item list-group-item-action d-flex align-items-center mb-1"
            onClick={() => handleOpenModal(item)}
            style={{ wordBreak: "break-word" }}  // Added to prevent text overflow
        >
            <FaFileAlt className="me-3 text-primary flex-shrink-0" />
            <div className="flex-grow-1">
                <h5
                    className="mb-1 text-truncate "
                    style={{ maxWidth: "100%", whiteSpace: "normal", wordBreak: "break-word" }}  // Ensure text wraps
                >
                    {capitalizeFirstLetter(item.issue_type)}
                </h5>
                <p
                    className="mb-1 text-truncate"
                    style={{ maxWidth: "100%", whiteSpace: "normal", wordBreak: "break-word" }}  // Ensure text wraps
                >
                    {item.location}
                </p>
                <p
                    className="mb-1"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                        whiteSpace: "normal",  // Ensure text wraps
                        wordBreak: "break-word" // Prevent long words from overflowing
                    }}
                >
                    {item.description}
                </p>
                <small className="text-muted">{formatStatus(item.status)}</small>
            </div>
            <FaChevronRight className="text-secondary flex-shrink-0" />
        </div>
    ), (prevProps, nextProps) => prevProps.item.id === nextProps.item.id);

    return (
        <div className="container mt-5">
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

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Reports</h2>
                <button className="btn btn-success rounded-0" onClick={() => handleOpenModal()}>
                    <FaPlusCircle className="me-1" /> Create Report
                </button>
            </div>
            <div className="d-flex justify-content-between mb-3">
                <div className="btn-group">
                    <button onClick={() => handleStatusFilter('pending')} className={`rounded-0 btn ${selectedStatus === 'pending' ? 'btn-dark' : 'btn-outline-dark'}`}>Pending</button>
                    <button onClick={() => handleStatusFilter('in_progress')} className={`rounded-0 btn ${selectedStatus === 'in_progress' ? 'btn-dark' : 'btn-outline-dark'}`}>In Progress</button>
                    <button onClick={() => handleStatusFilter('resolved')} className={`rounded-0 btn ${selectedStatus === 'resolved' ? 'btn-dark' : 'btn-outline-dark'}`}>Resolved</button>
                </div>
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                        type="text"
                        className="form-control rounded-0"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="input-group-text rounded-0">
                        <FaSearch />
                    </span>
                </div>
            </div>
            <div className="list-group">
                {loading ? <p>Loading reports...</p> :
                    (currentReports.length > 0 ? currentReports.map(report => (
                        <ReportItem key={report.id} item={report} />
                    )) : <p>No reports found.</p>)}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <span className="me-2">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setCurrentPage(1);  // Reset to first page when items per page changes
                            setItemsPerPage(parseInt(e.target.value, 10));
                        }}
                        className="form-select d-inline-block rounded-0"
                        style={{ width: "auto" }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={30}>30</option>
                        <option value={35}>35</option>
                        <option value={40}>40</option>
                        <option value={45}>45</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="ms-2">items per page</span>
                </div>
                <div>
                    <span>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} reports
                    </span>
                </div>
            </div>

            {/* Pagination */}
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    {/* Previous Button */}
                    <li className={`rounded-0 page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="rounded-0 page-link"
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`rounded-0 page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="rounded-0 page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    {/* Next Button */}
                    <li className={`rounded-0 page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="rounded-0 page-link"
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            <ReportModal
                show={showModal}
                handleClose={handleCloseModal}
                existingReport={existingReport}
                fetchReports={fetchReports}
                setReports={setReports}
            />
        </div>

    );
};

export default ReportScreen;
