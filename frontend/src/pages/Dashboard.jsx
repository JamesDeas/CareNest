import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import ApplicationsList from '../components/ApplicationsList';

function Dashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminJobs, setAdminJobs] = useState([]);

    useEffect(() => {
        if (user.role === 'admin') {
            fetchAdminData();
        } else if (user.role === 'employer') {
            fetchEmployerData();
        } else {
            fetchJobSeekerData();
        }
    }, [user]);

    const fetchAdminData = async () => {
        try {
            const [usersResponse, jobsResponse] = await Promise.all([
                api.get('/admin/all-users'),
                api.get('/admin/all-jobs')
            ]);
            console.log('Users Response:', usersResponse.data);
            console.log('Jobs Response:', jobsResponse.data);
            setAdminUsers(usersResponse.data);
            setAdminJobs(jobsResponse.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployerData = async () => {
        try {
            console.log('Current user:', user);
            const response = await api.get('/jobs/employer/my-jobs');
            console.log('Employer jobs response:', response.data);
            setJobs(response.data);
            
            if (response.data.length > 0) {
                setSelectedJob(response.data[0]);
                const applicationsResponse = await api.get(`/applications/job/${response.data[0]._id}`);
                setApplications(applicationsResponse.data);
            }
        } catch (err) {
            console.error('Error fetching employer data:', err);
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchJobSeekerData = async () => {
        try {
            const [applicationsResponse, savedJobsResponse] = await Promise.all([
                api.get('/applications/my-applications'),
                api.get('/saved-jobs/my-saved-jobs')
            ]);
            
            const validApplications = applicationsResponse.data.filter(app => app.job);
            setApplications(validApplications);

            const validSavedJobs = savedJobsResponse.data
                .filter(savedJob => savedJob && savedJob.job)
                .map(savedJob => savedJob.job);
            setSavedJobs(validSavedJobs);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleJobSelect = async (job) => {
        setSelectedJob(job);
        try {
            const response = await api.get(`/applications/job/${job._id}`);
            setApplications(response.data);
        } catch (err) {
            console.error('Error fetching applications:', err);
        }
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            await api.delete(`/saved-jobs/unsave/${jobId}`);
            setSavedJobs(savedJobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error unsaving job:', error);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await api.patch(`/applications/${applicationId}/status`, {
                status: newStatus
            });
            
            // Refresh the applications for the selected job
            if (selectedJob) {
                const applicationsResponse = await api.get(`/applications/job/${selectedJob._id}`);
                setApplications(applicationsResponse.data);
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDownloadCV = (applicationId) => {
        window.open(`${import.meta.env.VITE_API_URL}/applications/cv/${applicationId}`, '_blank');
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await api.delete(`/jobs/${jobId}`);
            // Remove the job from the jobs list
            setJobs(jobs.filter(job => job._id !== jobId));
            // If the deleted job was selected, clear the selection
            if (selectedJob && selectedJob._id === jobId) {
                setSelectedJob(null);
                setApplications([]);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleWithdrawApplication = async (applicationId) => {
        try {
            await api.delete(`/applications/${applicationId}`);
            // Remove the application from the list
            setApplications(applications.filter(app => app._id !== applicationId));
        } catch (error) {
            console.error('Error withdrawing application:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`); // Adjust the endpoint as needed
            setAdminUsers(adminUsers.filter(user => user._id !== userId)); // Update state
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    const deleteJob = async (jobId) => {
        try {
            await api.delete(`/admin/jobs/${jobId}`); // Adjust the endpoint as needed
            setAdminJobs(adminJobs.filter(job => job._id !== jobId)); // Update state
        } catch (err) {
            console.error('Error deleting job:', err);
            setError('Failed to delete job');
        }
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-red-900 text-white">
                {/* Background image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("/elements/bg.jpg")',
                        opacity: '0.2'
                    }}
                />
                
                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-xl mb-8 text-gray-100">
                        {user.role === 'employer' 
                            ? 'Manage your job listings and applications' 
                            : 'Manage your job applications and saved jobs'}
                    </p>
                    {user.role === 'employer' && (
                        <Link
                            to="/post-job"
                            className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-red-900 transition-colors"
                        >
                            Post New Job
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-8">
                {user.role === 'admin' ? (
                    // Admin View
                    <>
                        <h2 className="text-2xl font-medium text-red-950 mb-6">Admin Dashboard</h2>
                        <h3 className="text-xl font-medium text-red-950 mb-4">Users</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Name</th>
                                        <th className="py-3 px-6 text-left">Email</th>
                                        <th className="py-3 px-6 text-left">Role</th>
                                        <th className="py-3 px-6 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {adminUsers.length > 0 ? (
                                        adminUsers.map(user => (
                                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-6">{user.name}</td>
                                                <td className="py-3 px-6">{user.email}</td>
                                                <td className="py-3 px-6">{user.role}</td>
                                                <td className="py-3 px-6">
                                                    <button
                                                        onClick={() => deleteUser(user._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-3 px-6 text-center">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <h3 className="text-xl font-medium text-red-950 mb-4">Jobs</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Title</th>
                                        <th className="py-3 px-6 text-left">Company</th>
                                        <th className="py-3 px-6 text-left">Location</th>
                                        <th className="py-3 px-6 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {adminJobs.length > 0 ? (
                                        adminJobs.map(job => (
                                            <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-6">{job.title}</td>
                                                <td className="py-3 px-6">{job.company}</td>
                                                <td className="py-3 px-6">{job.location}</td>
                                                <td className="py-3 px-6">
                                                    <button
                                                        onClick={() => deleteJob(job._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-3 px-6 text-center">No jobs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : user.role === 'employer' ? (
                    // Employer View
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-medium text-red-950">{job.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                                        <p className="mt-1 text-sm text-gray-500">£{job.salary.toLocaleString()} per year</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="text-red-700 hover:text-red-900 text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/edit-job/${job._id}`}
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteJob(job._id);
                                                    }}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <button
                                            onClick={() => handleJobSelect(job)}
                                            className="w-full text-left text-sm text-red-700 hover:text-red-900 font-medium"
                                        >
                                            View Applications →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedJob && (
                            <div className="mt-16">
                                <h2 className="text-2xl font-medium text-red-950 mb-8">
                                    Applications for {selectedJob.title}
                                </h2>
                                <ApplicationsList 
                                    applications={applications}
                                    onUpdateStatus={handleStatusChange}
                                    onDownloadCV={handleDownloadCV}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    // Job Seeker View
                    <div className="space-y-12">
                        {/* Applications Section */}
                        <div>
                            <h2 className="text-2xl font-medium text-red-950 mb-6">
                                Your Applications
                            </h2>
                            {applications.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {applications.map((application) => (
                                        <div
                                            key={application._id}
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                                        >
                                            <h3 className="text-xl font-medium text-red-950">{application.job.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{application.job.location}</p>
                                            <p className="mt-2 text-sm text-gray-700">Status: {application.status}</p>
                                            <div className="mt-4 flex justify-between items-center">
                                                <Link
                                                    to={`/jobs/${application.job._id}`}
                                                    className="text-red-700 hover:text-red-900 text-sm font-medium"
                                                >
                                                    View Job
                                                </Link>
                                                <button
                                                    onClick={() => handleWithdrawApplication(application._id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Withdraw
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No applications yet</p>
                            )}
                        </div>

                        {/* Saved Jobs Section */}
                        <div>
                            <h2 className="text-2xl font-medium text-red-950 mb-6">
                                Saved Jobs
                            </h2>
                            {savedJobs.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {savedJobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                                        >
                                            <h3 className="text-xl font-medium text-red-950">{job.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                                            <p className="mt-1 text-sm text-gray-500">£{job.salary.toLocaleString()} per year</p>
                                            <div className="mt-4 flex justify-between items-center">
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="text-red-700 hover:text-red-900 text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                                <button
                                                    onClick={() => handleUnsaveJob(job._id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Unsave
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No saved jobs</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;