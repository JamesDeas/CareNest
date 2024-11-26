import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

function JobCard({ job, isHomePage = false, isBrowsePage = false }) {
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const response = await api.get('/saved-jobs/my-saved-jobs');
                const isSaved = response.data.some(saved => saved.job && saved.job._id === job._id);
                setIsSaved(isSaved);
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };

        if (user && user.role === 'jobseeker') {
            checkIfSaved();
        }
    }, [job._id, user]);

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsLoading(true);
            if (isSaved) {
                await api.delete(`/saved-jobs/unsave/${job._id}`);
                setIsSaved(false);
            } else {
                await api.post(`/saved-jobs/save/${job._id}`);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling save status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isBrowsePage) {
        return (
            <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:w-[400px]">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <h2 className="text-xl font-semibold text-red-950 truncate">
                                        {job.title}
                                    </h2>
                                    <div className="mt-1 flex items-center text-sm text-gray-600">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{job.company}</span>
                                    </div>
                                </div>
                                {user && user.role === 'jobseeker' && (
                                    <button
                                        onClick={handleSaveToggle}
                                        disabled={isLoading}
                                        className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${
                                            isSaved 
                                                ? 'text-yellow-500 hover:text-yellow-600' 
                                                : 'text-gray-400 hover:text-gray-500'
                                        }`}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-6 w-6" 
                                            fill={isSaved ? "currentColor" : "none"}
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2 w-full md:w-[400px]">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 w-[100px] justify-center">
                                    {job.type}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 w-[120px] justify-center">
                                    £{job.salary.toLocaleString()}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 w-[150px] justify-center truncate">
                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">{job.location}</span>
                                </span>
                            </div>
                            <Link 
                                to={`/jobs/${job._id}`}
                                className="inline-flex items-center px-4 py-2 border border-red-900 text-sm font-medium rounded-md shadow-sm text-red-900 bg-white hover:bg-red-900 hover:text-white transition-colors w-[120px] justify-center"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isHomePage) {
        return (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <h2 className="text-xl font-semibold text-red-950 hover:text-red-700 transition-colors">
                                    {job.title}
                                </h2>
                                {user && user.role === 'jobseeker' && (
                                    <button
                                        onClick={handleSaveToggle}
                                        disabled={isLoading}
                                        className={`ml-4 p-2 rounded-full transition-colors ${
                                            isSaved 
                                                ? 'text-yellow-500 hover:text-yellow-600' 
                                                : 'text-gray-400 hover:text-gray-500'
                                        }`}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-6 w-6" 
                                            fill={isSaved ? "currentColor" : "none"}
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {job.company}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                    {job.type}
                                </span>
                                <span className="text-gray-600 text-sm">
                                    £{job.salary.toLocaleString()}
                                </span>
                            </div>
                            <Link 
                                to={`/jobs/${job._id}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-red-900 text-sm font-medium rounded-md text-red-900 bg-white hover:bg-red-900 hover:text-white transition-colors duration-200"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-red-950 mb-2">
                        {job.title}
                    </h2>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-gray-500 mb-2">{job.location}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>£{job.salary.toLocaleString()} per year</span>
                        <span>•</span>
                        <span>{job.type}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {user && user.role === 'jobseeker' && (
                        <button
                            onClick={handleSaveToggle}
                            disabled={isLoading}
                            className={`p-2 rounded-full transition-colors ${
                                isSaved 
                                    ? 'text-yellow-500 hover:text-yellow-600' 
                                    : 'text-gray-400 hover:text-gray-500'
                            }`}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill={isSaved ? "currentColor" : "none"}
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                                />
                            </svg>
                        </button>
                    )}
                    <Link 
                        to={`/jobs/${job._id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-red-900 text-sm font-medium rounded-md text-red-900 bg-white hover:bg-red-900 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default JobCard;
