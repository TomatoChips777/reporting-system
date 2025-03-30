import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis, LineChart, Line, BarChart, Bar, ResponsiveContainer } from "recharts";
import { IoPieChart, IoCalendar, IoDocumentText, IoTime, IoPeople, IoLocation } from "react-icons/io5";
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
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchAnalytics();

        socket.on("update", () => {
            fetchAnalytics();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (!analytics) return <p className="text-center mt-5">Loading analytics...</p>;

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff5733", "#28a745"];
    const formattedIssueDistribution = analytics.issueDistribution.map((entry) => ({
        ...entry,
        category: entry.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    }));

    const priorityDistribution = [
        { name: "Low", count: analytics.latestReports.filter(report => report.priority === "Low").length },
        { name: "Medium", count: analytics.latestReports.filter(report => report.priority === "Medium").length },
        { name: "High", count: analytics.latestReports.filter(report => report.priority === "High").length },
        { name: "Urgent", count: analytics.latestReports.filter(report => report.priority === "Urgent").length },
    ];

    return (
        <div className="container-fluid mb-5">
            {/* <h2 className="text-center mb-4 text-primary">
                <IoPieChart className="me-2" /> Admin Dashboard Analytics
            </h2> */}

            {/* Card Summary Section */}
            <div className="row text-center mb-5">
                <div className="col-md-3 col-6 mb-4 mb-md-0">
                    <div className="card shadow-lg bg-primary text-white p-4 rounded-3">
                        <h5>
                            <IoDocumentText className="me-2" /> Total Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.totalReports || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-4 mb-md-0">
                    <div className="card shadow-lg bg-warning text-white p-4 rounded-3">
                        <h5>
                            <IoTime className="me-2" /> Pending Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.pending || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-4 mb-md-0">
                    <div className="card shadow-lg bg-info text-white p-4 rounded-3">
                        <h5>
                            <IoTime className="me-2" /> In Progress
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.in_progress || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card shadow-lg bg-success text-white p-4 rounded-3">
                        <h5>
                            <IoTime className="me-2" /> Resolved Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.resolved || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Priority and Issue Type Distribution Pie Charts */}
            <div className="row mb-5">
                {/* Priority Distribution Card */}
                <div className="col-md-6 mb-5">
                    <div className="card shadow-lg p-4">
                        <h5 className="mb-3 text-secondary">
                            <IoPieChart className="me-2" /> Priority Distribution
                        </h5>
                        {priorityDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie data={priorityDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={180}>
                                        {priorityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No priority data available</p>
                        )}
                    </div>
                </div>

                {/* Issue Type Distribution Card */}
                <div className="col-md-6 mb-5">
                    <div className="card shadow-lg p-4">
                        <h5 className="mb-3 text-secondary">
                            <IoPieChart className="me-2" /> Issue Type Distribution
                        </h5>
                        {analytics.issueDistribution?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie data={formattedIssueDistribution} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={180}>
                                        {analytics.issueDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No issue data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reports Per Day and Per Month */}
            <div className="row mb-5">
                {/* Reports Per Day Card */}
                <div className="col-md-6 mb-5">
                    <div className="card shadow-lg p-4">
                        <h5 className="text-secondary mb-3">
                            <IoCalendar className="me-2" /> Reports Per Day
                        </h5>
                        {analytics.reportsPerDay?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analytics.reportsPerDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                                            weekday: 'short', month: 'long', day: 'numeric'
                                        })}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>

                {/* Reports Per Month Card */}
                <div className="col-md-6 mb-5">
                    <div className="card shadow-lg p-4">
                        <h5 className="text-secondary mb-3">
                            <IoCalendar className="me-2" /> Reports Per Month
                        </h5>
                        {analytics.reportsPerMonth?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.reportsPerMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Latest Reports Table */}
            <div className="mb-5">
                <h5 className="text-secondary mb-3">
                    <IoDocumentText className="me-2" /> Latest Reports
                </h5>
                <table className="table table-striped shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Location</th>
                            <th>Issue Type</th>
                            <th>Priority</th>
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
                                    <td>{report.category}</td>
                                    <td>
                                        <span
                                            className={`rounded-0 badge 
                                                    ${report.priority === "Low" ? "bg-success" :
                                                    report.priority === "Medium" ? "bg-primary" :
                                                        report.priority === "High" ? "bg-warning" :
                                                            report.priority === "Urgent" ? "bg-danger" : "bg-secondary"
                                                }`}
                                        >
                                            {report.priority}
                                        </span>
                                    </td>
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
                                <td colSpan="6" className="text-center">No reports available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
