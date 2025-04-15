import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { IoPieChart, IoCalendar, IoDocumentText, IoTime } from "react-icons/io5";
import { Badge } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Title);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff5733", "#28a745"];

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
        socket.on("update", () => fetchAnalytics());
        return () => socket.disconnect();
    }, []);

    if (!analytics) return <p className="text-center mt-5">Loading analytics...</p>;

    const transformedTrend = () => {
        const grouped = {};
        analytics.reportsTrend.forEach(({ date, category, count }) => {
            const day = new Date(date).toISOString().split("T")[0];
            if (!grouped[day]) grouped[day] = { date: day };
            grouped[day][category] = count;
        });
        const categories = Array.from(new Set(analytics.reportsTrend.map(d => d.category)));
        return Object.values(grouped).map(entry => {
            categories.forEach(cat => {
                if (!entry[cat]) entry[cat] = 0;
            });
            return entry;
        });
    };

    const lineData = {
        labels: transformedTrend().map(d => d.date),
        datasets: Array.from(new Set(analytics.reportsTrend.map(d => d.category))).map((category, index) => ({
            label: category,
            data: transformedTrend().map(d => d[category]),
            borderColor: COLORS[index % COLORS.length],
            fill: false,
            tension: 0.4,
        })),
    };

    const priorityData = {
        labels: ["Low", "Medium", "High", "Urgent"],
        datasets: [{
            data: ["Low", "Medium", "High", "Urgent"].map(p =>
                analytics.latestReports.filter(r => r.priority === p).length),
            backgroundColor: COLORS,
        }],
    };

    const issueData = {
        labels: analytics.issueDistribution.map(e => e.category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())),
        datasets: [{
            data: analytics.issueDistribution.map(e => e.count),
            backgroundColor: COLORS,
        }],
    };

    const dailyData = {
        labels: analytics.reportsPerDay.map(r => new Date(r.date).toLocaleDateString()),
        datasets: [{
            label: "Reports",
            data: analytics.reportsPerDay.map(r => r.count),
            borderColor: "#8884d8",
            fill: false,
            tension: 0.4,
        }],
    };

    const monthlyData = {
        labels: analytics.reportsPerMonth.map(r => r.month),
        datasets: [{
            label: "Reports",
            data: analytics.reportsPerMonth.map(r => r.count),
            backgroundColor: "#82ca9d",
        }],
    };

    return (
        <div className="container-fluid p-2">
            <h4 className="mb-3 text-success">
                <IoPieChart className="me-2" /> Report Analytics
            </h4>

            {/* Summary Cards */}
            <div className="row mb-2 g-2">
                {[
                    { title: "Total Reports", value: analytics.totalReports, bg: "primary" },
                    { title: "Pending", value: analytics.statusCount?.pending, bg: "warning" },
                    { title: "In Progress", value: analytics.statusCount?.in_progress, bg: "info" },
                    { title: "Resolved", value: analytics.statusCount?.resolved, bg: "success" }
                ].map((item, idx) => (
                    <div className="col-6 col-md-3" key={idx}>
                        <div className={`card text-white bg-${item.bg} p-2 shadow-sm`}>
                            <div className="text-center">
                                <h6>{item.title}</h6>
                                <h4 className="fw-bold">{item.value || 0}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Line Chart */}
            <div className="card p-2 mb-2 shadow-sm">
                <h6 className="text-secondary mb-2">
                    <IoCalendar className="me-2" />Reports Trend
                </h6>
                <div style={{ height: 250 }} className="w-100">
                    <Line
                        data={lineData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: "bottom" } },
                        }}
                    />
                </div>
            </div>


            {/* Pie Charts */}
            <div className="row g-2 mb-2">
                <div className="col-md-6">
                    <div className="card p-2 shadow-sm h-100">
                        <h6 className="text-secondary mb-2">Priority Distribution</h6>
                        <div className="d-flex align-items-center" style={{ height: 200 }}>
                            <div className="flex-grow-1">
                                <Pie
                                    data={priorityData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: "bottom" } },
                                    }}
                                />
                            </div>
                            <div className="ps-3" style={{ minWidth: 140 }}>
                                <p className="small text-muted">
                                    This chart shows how incidents are prioritized based on urgency levels:
                                    <br />
                                    <span className="fw-semibold">Low</span>, <span className="fw-semibold">Medium</span>, <span className="fw-semibold">High</span>, and <span className="fw-semibold">Urgent</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-2 shadow-sm h-100">
                        <h6 className="text-secondary mb-2">Issue Type Distribution</h6>
                        <div className="d-flex align-items-center" style={{ height: 200 }}>
                            <div className="flex-grow-1" >
                                <Pie
                                    data={issueData}
                                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
                                />
                            </div>
                            <div className="ps-3" style={{ minWidth: 120 }}>
                                <p className="small text-muted">This pie chart visualizes the proportion of reported issue types.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily & Monthly Reports */}
            <div className="row g-2 mb-2">
                {/* Reports Per Day */}
                <div className="col-md-6">
                    <div className="card p-2 shadow-sm h-100">
                        <h6 className="text-secondary mb-2">Reports Per Day</h6>
                        <div className="d-flex align-items-center" style={{ height: 200 }}>
                            <div className="flex-grow-1 w-100">
                                <Line
                                    data={dailyData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: "bottom" },
                                        },
                                    }}
                                />
                            </div>
                            <div className="ps-3" style={{ minWidth: 140 }}>
                                <p className="small text-muted mb-0">
                                    This line chart shows how many reports are filed daily, helping track incident volume trends over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reports Per Month */}
                <div className="col-md-6">
                    <div className="card p-2 shadow-sm h-100">
                        <h6 className="text-secondary mb-2">Reports Per Month</h6>
                        <div className="d-flex align-items-center" style={{ height: 200 }}>
                            <div className="flex-grow-1 w-100">
                                <Bar
                                    data={monthlyData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: "bottom" },
                                        },
                                    }}
                                />
                            </div>
                            <div className="ps-3" style={{ minWidth: 140 }}>
                                <p className="small text-muted mb-0">
                                    This bar chart summarizes monthly incident reports, helping identify peak reporting periods.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Reports Table */}
            <div className="card shadow-sm">
                <div className="card-header bg-success text-white p-2">
                    <h6><IoDocumentText className="me-2" />Latest Reports</h6>
                </div>
                <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                        <thead className="table-success">
                            <tr>
                                <th>ID</th>
                                <th>Location</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th className="text-center">Reported At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.latestReports?.length ? analytics.latestReports.map((report, index) => (
                                <tr key={index}>
                                    <td>{report.id}</td>
                                    <td>{report.location}</td>
                                    <td>{report.category}</td>
                                    <td>
                                        <Badge bg={report.priority === "Low" ? "success" : report.priority === "Medium" ? "primary" : report.priority === "High" ? "warning" : "danger"}>
                                            {report.priority}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={report.status === "pending" ? "warning" : report.status === "in_progress" ? "primary" : "success"}>
                                            {report.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        {new Date(report.created_at).toLocaleString('en-US', {
                                            timeZone: 'Asia/Manila',
                                            month: 'short', day: 'numeric', year: 'numeric',
                                            hour: 'numeric', minute: '2-digit', hour12: true
                                        })}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="text-center">No reports available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncidentReportDashboard;
