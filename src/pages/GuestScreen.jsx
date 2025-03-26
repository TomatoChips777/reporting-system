import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GuestScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        report: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const response = await axios.post('http://localhost:5000/api/guest-report', formData);
            if (response.status === 200) {
                setMessage('Report submitted successfully!');
                setFormData({ name: '', email: '', report: '' }); // Reset form
            }
        } catch (error) {
            setMessage('Failed to submit report. Please try again.');
        }
    };
    return (
        <div className="container mt-5">
            <h1 className="text-center">Welcome</h1>
            <p className="text-center">Submit reports</p>

            <div className="card p-4 shadow">
                <h3>Submit a Report</h3>
                {message && <p className="alert alert-info">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Report Details</label>
                        <textarea 
                            className="form-control" 
                            name="report" 
                            rows="4" 
                            value={formData.report} 
                            onChange={handleChange} 
                            required 
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Report</button>
                </form>
            </div>

            <div className="text-center mt-3">
                <p>Login to track down your reports.</p>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};
export default GuestScreen;
