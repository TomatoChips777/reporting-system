import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { IoPieChart, IoCalendar, IoDocumentText, IoTime } from "react-icons/io5";
import { Badge,Form } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [resolvedView, setResolvedView] = useState("day");
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_API_URL}`);

        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_MAINTENANCE_ANALYTICS}`);
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchAnalytics();
        socket.on("update", fetchAnalytics);
        return () => socket.disconnect();
    }, []);

    if (!analytics) return <p className="text-center mt-5">Loading analytics...</p>;
    const resolvedChart = {
        day: {
            labels: analytics.resolvedPerDay.map(r => new Date(r.date).toLocaleDateString()),
            datasets: [{
                label: 'Resolved per Day',
                data: analytics.resolvedPerDay.map(r => r.count),
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                fill: true,
            }]
        },
        week: {
            labels: analytics.resolvedPerWeek.map(r => r.week),
            datasets: [{
                label: 'Resolved per Week',
                data: analytics.resolvedPerWeek.map(r => r.count),
                backgroundColor: '#17a2b8'
            }]
        },
        month: {
            labels: analytics.resolvedPerMonth.map(r => r.month),
            datasets: [{
                label: 'Resolved per Month',
                data: analytics.resolvedPerMonth.map(r => r.count),
                backgroundColor: '#ffc107'
            }]
        },
        year: {
            labels: analytics.resolvedPerYear.map(r => r.year),
            datasets: [{
                label: 'Resolved per Year',
                data: analytics.resolvedPerYear.map(r => r.count),
                backgroundColor: '#6f42c1'
            }]
        }
    };
    
    // Priority Pie Chart Data
    const priorityChart = {
        labels: ["Low", "Medium", "High", "Urgent"],
        datasets: [{
            label: 'Priority',
            data: [
                analytics.latestReports.filter(r => r.priority === "Low").length,
                analytics.latestReports.filter(r => r.priority === "Medium").length,
                analytics.latestReports.filter(r => r.priority === "High").length,
                analytics.latestReports.filter(r => r.priority === "Urgent").length,
            ],
            backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545']
        }]
    };

    // Issue Type Pie Chart Data
    const issueChart = {
        labels: analytics.issueDistribution.map(i => i.category.replace(/_/g, " ")),
        datasets: [{
            label: 'Issues',
            data: analytics.issueDistribution.map(i => i.count),
            backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff5733', '#28a745']
        }]
    };

    // Daily Reports Line Chart
    const dailyChart = {
        labels: analytics.reportsPerDay.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
            label: 'Reports per Day',
            data: analytics.reportsPerDay.map(d => d.count),
            borderColor: '#8884d8',
            backgroundColor: 'rgba(136,132,216,0.2)',
            fill: true,
        }]
    };

    // Monthly Reports Bar Chart
    const monthlyChart = {
        labels: analytics.reportsPerMonth.map(d => d.month),
        datasets: [{
            label: 'Reports per Month',
            data: analytics.reportsPerMonth.map(d => d.count),
            backgroundColor: '#82ca9d'
        }]
    };

    // Reports Trend Line Chart
    const trendChart = (() => {
        const grouped = {};
        analytics.reportsTrend.forEach(({ date, category, count }) => {
            const d = new Date(date).toISOString().split("T")[0];
            if (!grouped[d]) grouped[d] = {};
            grouped[d][category] = count;
        });

        const dates = Object.keys(grouped).sort();
        const categories = Array.from(new Set(analytics.reportsTrend.map(d => d.category)));

        return {
            labels: dates,
            datasets: categories.map((cat, i) => ({
                label: cat,
                data: dates.map(date => grouped[date][cat] || 0),
                borderColor: `hsl(${i * 60}, 70%, 50%)`,
                backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.2)`,
                fill: true,
                tension: 0.4
            }))
        };
    })();


    return (
        <div className="container-fluid">
            <h2 className="mb-4 text-success">
                <IoPieChart className="me-2" /> Report Dashboard Analytics
            </h2>

            {/* Summary Cards */}
            <div className="row text-center mb-3">
                {[
                    { label: "Total Reports", icon: IoDocumentText, color: "primary", value: analytics.totalReports ?? 0 },
                    { label: "Pending", icon: IoTime, color: "warning", value: analytics.statusCount?.pending ?? 0 },
                    { label: "In Progress", icon: IoTime, color: "info", value: analytics.statusCount?.in_progress ?? 0 },
                    { label: "Resolved", icon: IoTime, color: "success", value: analytics.statusCount?.resolved ?? 0 }
                ].map(({ label, icon: Icon, color, value }, i) => (
                    <div className="col-md-3 col-6 mb-3" key={i}>
                        <div className={`card shadow bg-${color} text-white p-2 shadow-sm`}>
                            <h5><Icon className="me-2" size={20} /> {label}</h5>
                            {/* <h6>{label}</h6> */}
                            <h2 className="fw-bold">{value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card p-3 shadow-sm mb-3">
    <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-secondary mb-0">
            <IoCalendar className="me-2" /> Resolved Reports
        </h6>
        <Form.Select value={resolvedView} onChange={(e) => setResolvedView(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
        </Form.Select>
    </div>
    <div style={{ height: 250 }} className="w-100">
        {resolvedView === "day" ? (
            <Line data={resolvedChart.day} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
            <Bar data={resolvedChart[resolvedView]} options={{ responsive: true, maintainAspectRatio: false }} />
        )}
    </div>
</div>

            {/* Reports Trend Graph */}
            <div className="card p-3 shadow-sm mb-3">
                <h6 className="text-secondary"><IoCalendar className="me-2" /> Reports Trend</h6>
                <div style={{ height: 250 }} className="w-100">
                    <Line data={trendChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
                </div>
            </div>


            {/* Graphs */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm">
                        <div className="row align-items-center">
                            <div className="col-5 d-flex justify-content-center">
                                <div style={{ maxWidth: 180 }}>
                                    <Pie data={priorityChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" }} }} height={180} />
                                </div>
                            </div>
                            <div className="col-7">
                                <h6 className="text-secondary mb-2">Priority Distribution</h6>
                                <p className="text-muted small mb-0">
                                    Shows how reports are distributed by priority: Low, Medium, High, and Urgent. Helps understand urgency trends.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm">
                        <div className="row align-items-center">
                            <div className="col-5 d-flex justify-content-center">
                                <div style={{ maxWidth: 180 }}>
                                    <Pie data={issueChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" }} }} height={180} />
                                </div>
                            </div>
                            <div className="col-7">
                                <h6 className="text-secondary mb-2">Issue Type Distribution</h6>
                                <p className="text-muted small mb-0">
                                    Visualizes report counts based on issue categories. Useful for identifying common problems.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm">
                        <h6 className="text-secondary">Reports Per Day</h6>
                        <Line data={dailyChart} />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm">
                        <h6 className="text-secondary">Reports Per Month</h6>
                        <Bar data={monthlyChart} />
                    </div>
                </div>
            </div>

            {/* Latest Reports Table */}
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h5><IoDocumentText className="me-2" /> Latest Reports</h5>
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
                            {analytics.latestReports?.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.id}</td>
                                    <td>{r.location}</td>
                                    <td>{r.category}</td>
                                    <td><Badge bg={r.priority === "Low" ? "success" : r.priority === "Medium" ? "primary" : r.priority === "High" ? "warning" : "danger"}>{r.priority}</Badge></td>
                                    <td><Badge bg={r.status === "pending" ? "warning" : r.status === "in_progress" ? "primary" : "success"}>{r.status.replace("_", " ")}</Badge></td>
                                    <td className="text-center">{new Date(r.created_at).toLocaleString()}</td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan="6" className="text-center">No reports available</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
