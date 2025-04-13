import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis, LineChart, Line, BarChart, Bar, ResponsiveContainer } from "recharts";
import { IoPieChart, IoCalendar, IoDocumentText, IoTime, IoPeople, IoLocation } from "react-icons/io5";
import { Badge } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { io } from 'socket.io-client';

const IncidentReportDashboard = () => {

    const [analytics, setAnalytics] = useState(null);
    useEffect(() => {

        const socket = io(`${import.meta.env.VITE_API_URL}`);

        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_INCIDENT_ANALYTICS}`);
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
    const transformTrendData = (data) => {
        const groupedData = {};

        data.forEach(({ date, category, count }) => {
            const formattedDate = new Date(date).toISOString().split("T")[0]; // Format YYYY-MM-DD

            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { date: formattedDate }; // Initialize
            }
            groupedData[formattedDate][category] = count; // Assign category count
        });

        // Get all possible categories
        const allCategories = Array.from(new Set(data.map((d) => d.category)));

        return Object.values(groupedData).map((entry) => {
            // Fill missing categories with 0
            allCategories.forEach((category) => {
                if (!entry[category]) entry[category] = 0;
            });
            return entry;
        });
    };


    return (
        <div className="container-fluid mb-1">
            <h2 className="mb-4 text-success">
                <IoPieChart className="me-2" />Report Dashboard Analytics
            </h2>
            <div className="row text-center mb-1">
                <div className="col-md-3 col-6 mb-2 mb-md-0">
                    <div className="card shadow-lg bg-primary text-white p-4 rounded-0">
                        <h5>
                            <IoDocumentText className="me-2" size={100} /> Total Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.totalReports || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-2 mb-md-0">
                    <div className="card shadow-lg bg-warning text-white p-4 rounded-0">
                        <h5>
                            <IoTime className="me-2" size={100} /> Pending Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.pending || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6 mb-2 mb-md-0">
                    <div className="card shadow-lg bg-info text-white p-4 rounded-0">
                        <h5>
                            <IoTime className="me-2" size={100} /> In Progress
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.in_progress || 0}</h2>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card shadow-lg bg-success text-white p-4 rounded-0">
                        <h5>
                            <IoTime className="me-2" size={100} /> Resolved Reports
                        </h5>
                        <h2 className="fw-bold">{analytics.statusCount?.resolved || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Line Graph - Reports Trend */}
            <div className="col-12 mb-1">
                <div className="card shadow-lg p-4">
                    <h5 className="text-secondary mb-3">
                        <IoCalendar className="me-2" /> Reports Trend
                    </h5>
                    {analytics.reportsTrend?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={transformTrendData(analytics.reportsTrend)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Array.from(new Set(analytics.reportsTrend.map(d => d.category))).map((category, index) => (
                                    <Line key={`line-${category}`} type="monotone" dataKey={category} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No trend data available</p>
                    )}
                </div>
            </div>

            {/* Priority and Issue Type Distribution Pie Charts */}
            <div className="row mb-2">
                {/* Priority Distribution Card */}
                <div className="col-md-6 mb-1">
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
                <div className="col-md-6 mb-2">
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
            {/* <div className="row mb-2"> */}
            {/* Reports Per Day Card */}
            <div className="col-12 mb-1">
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
            <div className="col-12 mb-1">
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
            <div className="mb-2">
                <div className="card shadow-lg p-0">
                    <div className="card-header bg-success text-white">
                        <h5>
                            <IoDocumentText className="me-2" /> Latest Reports
                        </h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className="table-success">
                                <tr>
                                    <th>ID</th>
                                    <th>Location</th>
                                    <th>Issue Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th className="text-center">Reported At</th>
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
                                                <Badge
                                                    bg={
                                                        report.priority === "Low" ? "success" :
                                                            report.priority === "Medium" ? "primary" :
                                                                report.priority === "High" ? "warning" :
                                                                    report.priority === "Urgent" ? "danger" : "secondary"
                                                    }
                                                    className="ms-2 rounded-0"
                                                >
                                                    {report.priority}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"} className="ms-2 rounded-0">
                                                    {report.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </Badge>
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
            </div>

        </div>
    );
};

export default IncidentReportDashboard;
