import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import ApplicationForm from '../components/ApplicationForm';

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [application, setApplication] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // First get the job details
                const jobResponse = await api.get(`/jobs/${id}`);
                setJob(jobResponse.data);

                // If user is a jobseeker, check for existing application
                if (user?.role === 'jobseeker') {
                    const applicationResponse = await api.get('/applications/my-applications');
                    const existingApplication = applicationResponse.data.find(
                        app => app.job && app.job._id === id
                    );
                    setApplication(existingApplication || null);
                }
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError(err.response?.data?.message || 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, user]);

    const handleApply = async (formData) => {
        try {
            setIsSubmitting(true);
            await api.post(`/applications/job/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
                    <p className="mt-4">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold">Error</p>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl font-semibold">Job Not Found</p>
                    <Link
                        to="/browse-jobs"
                        className="mt-4 inline-block px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
                    >
                        Browse Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-950 bg-gray-100 hover:bg-gray-200"
                >
                    ← Go Back
                </button>

                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-red-950 mb-4">
                            {job.title}
                        </h1>
                        <div className="text-base text-gray-500 mb-6">
                            <p>{job.company}</p>
                            <p>{job.location}</p>
                            <p>£{job.salary.toLocaleString()} per year</p>
                        </div>
                        
                        <div className="prose max-w-none mt-6">
                            <h2 className="text-2xl font-medium text-red-950 mb-4">
                                Job Description
                            </h2>
                            <p className="mt-2 text-gray-600 text-lg">
                                {job.description}
                            </p>
                            
                            <h2 className="text-2xl font-medium text-red-950 mt-8 mb-4">
                                Requirements
                            </h2>
                            {Array.isArray(job.requirements) ? (
                                <ul className="mt-2 list-disc list-inside text-gray-600 text-lg">
                                    {job.requirements.map((requirement, index) => (
                                        <li key={index}>{requirement}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-gray-600 text-lg">{job.requirements}</p>
                            )}
                            
                            {!application && job.howToApply && (
                                <>
                                    <h2 className="text-2xl font-medium text-red-950 mt-8 mb-4">
                                        How to Apply
                                    </h2>
                                    <p className="mt-2 text-gray-600 text-lg">{job.howToApply}</p>
                                </>
                            )}
                        </div>

                        {user?.role === 'jobseeker' && (
                            <div className="mt-6">
                                {application ? (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <p className="text-red-700">
                                            You have already applied for this position.{' '}
                                            <Link to="/dashboard" className="font-medium hover:text-red-900">
                                                View your application →
                                            </Link>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {showApplicationForm ? (
                                            <ApplicationForm 
                                                onSubmit={handleApply}
                                                isSubmitting={isSubmitting}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => setShowApplicationForm(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-600"
                                            >
                                                Apply for this position
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {!user && (
                            <div className="mt-8">
                                <p className="text-red-950">
                                    Please <Link to="/login" className="text-red-700 hover:text-red-900">log in</Link> as a job seeker to apply for this position.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
