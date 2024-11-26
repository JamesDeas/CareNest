import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

function PostJob() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        contactEmail: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!token) {
                throw new Error('You must be logged in to post a job');
            }

            const jobData = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(req => req.trim()),
                salary: parseInt(formData.salary, 10)
            };

            console.log('Posting job with token:', token);
            
            const response = await api.post('/jobs', jobData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Job posted successfully:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error posting job:', error);
            setError(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Simple Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-950 mb-2">
                        Post a New Job
                    </h1>
                    <p className="text-gray-600">
                        Find the perfect candidate for your healthcare position
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-900 p-4">
                            <p className="text-red-900">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 p-8">
                        <div>
                            <label className="block text-sm font-medium text-red-950">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Company</label>
                            <input
                                type="text"
                                name="company"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Location</label>
                            <input
                                type="text"
                                name="location"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Job Type</label>
                            <select
                                name="type"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Salary (per year)</label>
                            <input
                                type="number"
                                name="salary"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Description</label>
                            <textarea
                                name="description"
                                required
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">
                                Requirements (one per line)
                            </label>
                            <textarea
                                name="requirements"
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="Enter each requirement on a new line"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-red-950">Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900"
                                value={formData.contactEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PostJob;
