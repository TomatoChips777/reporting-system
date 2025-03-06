// import { useEffect, useState, useContext, memo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../../AuthContext';
// import axios from 'axios';
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaChevronRight, FaPlusCircle } from 'react-icons/fa';

// const ReportScreen = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedStatus, setSelectedStatus] = useState(null);

//     useEffect(() => {
//         fetchReports();
//     }, []);

//     const fetchReports = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`http://localhost:5000/api/reports/user/${user.id}`);
//             setReports(response.data.reports || []);
//         } catch (error) {
//             alert("Error: Failed to fetch reports.");
//         }
//         setLoading(false);
//     };

//     const totalReports = reports.length;
//     const pendingCount = reports.filter(r => r.status === 'pending').length;
//     const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
//     const resolvedCount = reports.filter(r => r.status === 'resolved').length;

//     const filteredReports = selectedStatus ? reports.filter(r => r.status === selectedStatus) : reports;

//     const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
//     const formatStatus = (status) => status === 'in_progress' ? 'In Progress' : capitalizeFirstLetter(status);

//     const handleDetails = (report) => navigate('/report-details', { state: { report } });
//     const handleStatusFilter = (status) => setSelectedStatus(status === selectedStatus ? null : status);

//     const ReportItem = memo(({ item }) => (
//         <div className="list-group-item list-group-item-action d-flex align-items-center mb-1" onClick={() => handleDetails(item)}>
//             <FaFileAlt className="me-3 text-primary" />
//             <div className="flex-grow-1">
//                 <h5 className="mb-1">{capitalizeFirstLetter(item.issue_type)}</h5>
//                 <p className="mb-1">{item.location}</p>
//                 <p className="mb-1">{item.description}</p>
//                 <small className="text-muted">{formatStatus(item.status)}</small>
//             </div>
//             <FaChevronRight className="text-secondary" />
//         </div>
//     ), (prevProps, nextProps) => prevProps.item.id === nextProps.item.id);

//     return (
//         <div className="container mt-4">
//             <div className="row mb-3">
//                 <div className="col-md-3">
//                     <div className="card p-3 text-center">
//                         <FaFileAlt className="text-success mb-2" size={30} />
//                         <h6>Total Reports</h6>
//                         <strong>{totalReports}</strong>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card p-3 text-center">
//                         <FaClock className="text-warning mb-2" size={30} />
//                         <h6>Pending</h6>
//                         <strong>{pendingCount}</strong>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card p-3 text-center">
//                         <FaTasks className="text-primary mb-2" size={30} />
//                         <h6>In Progress</h6>
//                         <strong>{inProgressCount}</strong>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card p-3 text-center">
//                         <FaCheckCircle className="text-success mb-2" size={30} />
//                         <h6>Resolved</h6>
//                         <strong>{resolvedCount}</strong>
//                     </div>
//                 </div>
//             </div>

//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h2>My Reports</h2>
//                 <button className="btn btn-success" onClick={() => navigate('/create-report')}>
//                     <FaPlusCircle className="me-1" /> Create Report
//                 </button>
//             </div>

//             <div className="btn-group mb-3">
//                 <button onClick={() => handleStatusFilter('pending')} className={`btn ${selectedStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}>Pending</button>
//                 <button onClick={() => handleStatusFilter('in_progress')} className={`btn ${selectedStatus === 'in_progress' ? 'btn-primary' : 'btn-outline-primary'}`}>In Progress</button>
//                 <button onClick={() => handleStatusFilter('resolved')} className={`btn ${selectedStatus === 'resolved' ? 'btn-success' : 'btn-outline-success'}`}>Resolved</button>
//             </div>

//             <div className="list-group">
//                 {loading ? <p>Loading reports...</p> : 
//                     (filteredReports.length > 0 ? filteredReports.map(report => (
//                         <ReportItem key={report.id} item={report} />
//                     )) : <p>No reports found.</p>)}
//             </div>
//         </div>
//     );
// };

// export default ReportScreen;

import { useEffect, useState, useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthContext';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFileAlt, FaClock, FaTasks, FaCheckCircle, FaChevronRight, FaPlusCircle } from 'react-icons/fa';
import ReportModal from '../components/CreateModal';

const ReportScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showModal, setShowModal] = useState(false);
const [existingReport, setExistingReport] = useState(null); // If editing an existing report

const handleOpenModal = (report = null) => {
    setExistingReport(report);
    setShowModal(true);
};

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        fetchReports();
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

    const filteredReports = selectedStatus ? reports.filter(r => r.status === selectedStatus) : reports;
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const formatStatus = (status) => status === 'in_progress' ? 'In Progress' : capitalizeFirstLetter(status);

    // const handleDetails = (report) => navigate('/report-details', { state: { report } });
    const handleStatusFilter = (status) => {
        setSelectedStatus(status === selectedStatus ? null : status);
        setCurrentPage(1);
    };
    const ReportItem = memo(({ item }) => (
        <div className="list-group-item list-group-item-action d-flex align-items-center mb-1" onClick={() => handleOpenModal(item)}>
            <FaFileAlt className="me-3 text-primary flex-shrink-0" />
            <div className="flex-grow-1">
                <h5 className="mb-1 text-truncate" style={{ maxWidth: "100%" }}>
                    {capitalizeFirstLetter(item.issue_type)}
                </h5>
                <p className="mb-1 text-truncate" style={{ maxWidth: "100%" }}>
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
                        maxWidth: "100%"
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
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col-md-3">
                    <div className="card p-3 text-center">
                        <FaFileAlt className="text-success mb-2" size={30} />
                        <h6>Total Reports</h6>
                        <strong>{totalReports}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center">
                        <FaClock className="text-warning mb-2" size={30} />
                        <h6>Pending</h6>
                        <strong>{pendingCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center">
                        <FaTasks className="text-primary mb-2" size={30} />
                        <h6>In Progress</h6>
                        <strong>{inProgressCount}</strong>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 text-center">
                        <FaCheckCircle className="text-success mb-2" size={30} />
                        <h6>Resolved</h6>
                        <strong>{resolvedCount}</strong>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Reports</h2>
                <button className="btn btn-success" onClick={()=> handleOpenModal()}>
                    <FaPlusCircle className="me-1" /> Create Report
                </button>
            </div>

            <div className="btn-group mb-3">
                <button onClick={() => handleStatusFilter('pending')} className={`btn ${selectedStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}>Pending</button>
                <button onClick={() => handleStatusFilter('in_progress')} className={`btn ${selectedStatus === 'in_progress' ? 'btn-primary' : 'btn-outline-primary'}`}>In Progress</button>
                <button onClick={() => handleStatusFilter('resolved')} className={`btn ${selectedStatus === 'resolved' ? 'btn-success' : 'btn-outline-success'}`}>Resolved</button>
            </div>

            <div className="list-group">
                {loading ? <p>Loading reports...</p> : 
                    (currentReports.length > 0 ? currentReports.map(report => (
                        <ReportItem key={report.id} item={report} />
                    )) : <p>No reports found.</p>)}
            </div>

            {/* Pagination */}
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <ReportModal
                show={showModal}
                handleClose={handleCloseModal}
                existingReport={existingReport}
                fetchReports={fetchReports}
            />
        </div>

    );
};

export default ReportScreen;
