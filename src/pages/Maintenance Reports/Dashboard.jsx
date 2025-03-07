import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMegaphoneOutline, IoConstructOutline, IoCubeOutline, IoBookOutline, IoWarningOutline } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h1 className="text-center text-dark fw-bold mb-4">Campus Reporting System</h1>

      {/* Bulletin Board Card */}
      <button
        className="w-100 btn btn-light border rounded-3 shadow-sm p-4 d-flex flex-column align-items-center mb-4"
        onClick={() => navigate("/details")} style={{backgroundColor: '#EDE7F6'}}
      >
        <IoMegaphoneOutline size={50} className=" mb-2" style={{color: "#673AB7"}} />
        <h5 className="fw-bold" style={{color: '#673AB7'}}>Bulletin Board</h5>
        <p className="text-muted text-center">View announcements and updates.</p>
      </button>

      {/* Grid Layout */}
      <div className="row g-3">
        <div className="col-6">
          <button
            className="btn btn-light border rounded-3 shadow-sm w-100 p-3 d-flex flex-column align-items-center"
            onClick={() => navigate("/reports")} 
          >
            <IoConstructOutline size={40} className=" mb-2" style={{color: "#FF9800"}} />
            <h6 className="fw-bold">Maintenance Reporting</h6>
            <p className="text-muted text-center small">Report maintenance issues.</p>
          </button>
        </div>

        <div className="col-6">
          <button
            className="btn btn-light border rounded-3 shadow-sm w-100 p-3 d-flex flex-column align-items-center"
            onClick={() => navigate("/lost-and-found")}
          >
            <IoCubeOutline size={40} className=" mb-2" style={{color: '#2196F3'}}/>
            <h6 className="fw-bold">Lost & Found</h6>
            <p className="text-muted text-center small">Report or find items.</p>
          </button>
        </div>

        <div className="col-6">
          <button
            className="btn btn-light border rounded-3 shadow-sm w-100 p-3 d-flex flex-column align-items-center"
            onClick={() => navigate("/borrowing")}
          >
            <IoBookOutline size={40} className="mb-2" style={{color: '#4CAF50'}} />
            <h6 className="fw-bold">Borrowing Items</h6>
            <p className="text-muted text-center small">Borrow items easily.</p>
          </button>
        </div>

        <div className="col-6">
          <button
            className="btn btn-light border rounded-3 shadow-sm w-100 p-3 d-flex flex-column align-items-center"
            onClick={() => navigate("/incident-reports")}
          >
            <IoWarningOutline size={40} className="mb-2" style={{color: '#F44336'}} />
            <h6 className="fw-bold">Incident Reporting</h6>
            <p className="text-muted text-center small">Report incidents safely.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
