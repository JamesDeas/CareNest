import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        const fetchJobs = async () => {
            try {
                const response = await api.get('/admin/jobs');
                setJobs(response.data);
            } catch (err) {
                setError('Failed to fetch jobs');
            }
        };

        fetchUsers();
        fetchJobs();
    }, []);

    const deleteUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const deleteJob = async (id) => {
        try {
            await api.delete(`/admin/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (err) {
            setError('Failed to delete job');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p>{error}</p>}
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.name} - {user.email}
                        <button onClick={() => deleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>Jobs</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        {job.title} 
                        <button onClick={() => deleteJob(job._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard; 