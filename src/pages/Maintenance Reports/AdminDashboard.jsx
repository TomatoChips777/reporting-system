import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { IoPieChart, IoCalendar, IoDocumentText, IoTime, IoPeople, IoLocation } from "react-icons/io5"; // Icons
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { io } from 'socket.io-client';

const AdminDashboard = () => {

    const [analytics, setAnalytics] = useState(null);
    useEffect(() => {
        const socket = io("http://localhost:5000");

        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/analytics/analytics");
                setAnalytics(response.data);  // Ensure state update triggers re-render
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchAnalytics(); // Fetch initially

        // Listen for real-time updates
        socket.on("update", () => {
            console.log("Received update event, fetching analytics...");
            fetchAnalytics();
        });

        return () => {
            socket.disconnect();
        };
    }, []); // Don't add `analytics` here to prevent infinite loops

    if (!analytics) return <p className="text-center mt-5">Loading analytics...</p>;

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff5733", "#28a745"];

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4 text-primary">
                <IoPieChart className="me-2" /> Admin Dashboard Analytics
            </h2>

            {/* Cards Section */}
            <div className="row text-center mb-4">
                <div className="col-md-3 col-6">
                    <div className="card shadow-lg bg-warning text-white p-3 rounded">
                        <h5>
                            <IoDocumentText className="me-2" /> Total Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.totalReports || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card shadow-lg bg-primary text-white p-3 rounded">
                        <h5>
                            <IoTime className="me-2" /> Pending Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.pending || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mt-3 mt-md-0">
                    <div className="card shadow-lg bg-danger text-white p-3 rounded">
                        <h5>
                            <IoTime className="me-2" /> In Progress
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.in_progress || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mt-3 mt-md-0">
                    <div className="card shadow-lg bg-success text-white p-3 rounded">
                        <h5>
                            <IoTime className="me-2" /> Resolved Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.resolved || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Reports Per Day and Per Month */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h5>
                        <IoCalendar className="me-2" /> Reports Per Day
                    </h5>
                    {analytics.reportsPerDay?.length > 0 ? (
                        <LineChart width={500} height={300} data={analytics.reportsPerDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'short', month: 'long', day: 'numeric'
                                })}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    value,
                                    new Date(props.payload.date).toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                    })
                                ]}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>

                <div className="col-md-6">
                    <h5>
                        <IoCalendar className="me-2" /> Reports Per Month
                    </h5>
                    {analytics.reportsPerMonth?.length > 0 ? (
                        <BarChart width={500} height={300} data={analytics.reportsPerMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#ff7300" />
                        </BarChart>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>

            {/* Issue Type Distribution */}
            <div className="text-center mb-4">
                <h5>
                    <IoPieChart className="me-2" /> Issue Type Distribution
                </h5>
                {analytics.issueDistribution?.length > 0 ? (
                    <div className="d-flex justify-content-center">
                        <div
                            style={{
                                backgroundColor: "#f8f9fa",
                                padding: "30px",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "500px",  // Increased width
                                height: "500px"  // Increased height
                            }}
                        >
                            <PieChart width={450} height={450}>
                                <Pie data={analytics.issueDistribution} dataKey="count" nameKey="issue_type" cx="50%" cy="50%" outerRadius={180}>
                                    {analytics.issueDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                ) : (
                    <p>No issue data available</p>
                )}
            </div>
            {/* Latest Reports */}
            <div className="mb-5">
                <h5>
                    <IoDocumentText className="me-2" /> Latest Reports
                </h5>
                <table className="table table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Location</th>
                            <th>Issue Type</th>
                            <th>Status</th>
                            <th className="text-center">Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {analytics.latestReports?.length > 0 ? (
                            analytics.latestReports.map((report, index) => (
                                <tr key={index}>
                                    <td>{report.id}</td>
                                    <td>{report.location}</td>
                                    <td>{report.issue_type}</td>
                                    <td>
                                        <span className={`rounded-0 badge ${report.status === "resolved" ? "bg-success" : report.status === "in_progress" ? "bg-primary" : "bg-warning"}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {new Date(report.created_at).toLocaleString('en-US', {
                                            timeZone: 'Asia/Manila',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No reports available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
