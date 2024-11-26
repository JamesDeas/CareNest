import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentJobs = async () => {
            try {
                const response = await api.get('/jobs');
                setJobs(response.data.slice(0, 6));
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/browse-jobs?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div>
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
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <h1 className="text-5xl font-bold text-center mb-6">
                        Find Your Dream Healthcare Role
                    </h1>
                    <p className="text-xl text-center mb-8 text-gray-100">
                        Discover thousands of healthcare opportunities with the UK's leading employers
                    </p>
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search healthcare jobs..."
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-red-900 border border-red-900 rounded-lg hover:bg-red-900 hover:text-white transition-colors font-medium"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200"></div>

            {/* Recent Jobs Section */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-red-950">Recent Healthcare Positions</h2>
                        <button
                            onClick={() => navigate('/browse-jobs')}
                            className="text-red-900 hover:text-red-800 transition-colors font-medium"
                        >
                            View All Jobs →
                        </button>
                    </div>

                    {loading ? (
                        
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {jobs.slice(0, 6).map(job => (
                                <JobCard key={job._id} job={job} isHomePage={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200"></div>

            {/* Guest-only sections */}
            {!user && (
                <>
                    {/* Job Seeker CTA Section */}
                    <div className="relative bg-red-900 py-24">
                        {/* Background image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: 'url("/elements/bg-2.jpg")',
                                opacity: '0.2'
                            }}
                        />
                        
                        {/* Content */}
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-12">
                                <div className="flex flex-col md:flex-row items-start justify-between">
                                    <div className="mb-6 md:mb-0 md:mr-8 flex-1">
                                        <h2 className="text-3xl font-bold text-white mb-4">
                                            Ready to Start Your Job Search?
                                        </h2>
                                        <p className="text-lg text-gray-100 mb-6">
                                            Create a free account to unlock these features:
                                        </p>
                                        <ul className="space-y-3 text-gray-100">
                                            <li className="flex items-center">
                                                <svg className="h-5 w-5 text-white mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Save jobs and track applications
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="h-5 w-5 text-white mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Get job alerts for your searches
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="h-5 w-5 text-white mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Quick apply to jobs
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col space-y-4 min-w-[200px]">
                                        <Link
                                            to="/register"
                                            className="inline-flex justify-center items-center px-6 py-3 border border-red-900 text-base font-medium rounded-md text-red-900 bg-white hover:bg-red-900 hover:text-white transition-colors"
                                        >
                                            Sign Up Now
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200"></div>

                    {/* Employer CTA Section */}
                    <div className="bg-gray-50 py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4 text-red-950">Are You an Employer?</h2>
                                <p className="text-xl text-gray-600">
                                    Post your jobs to find the perfect candidate
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <div className="text-center">
                                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-3 text-red-950">Quick & Easy</h3>
                                        <p className="text-gray-600">Post your job listing in minutes and start receiving applications</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-3 text-red-950">Reach Quality Candidates</h3>
                                        <p className="text-gray-600">Connect with qualified professionals actively seeking opportunities</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-3 text-red-950">Manage Applications</h3>
                                        <p className="text-gray-600">Review and manage all applications in one place</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-8 py-3 border border-red-900 text-base font-medium rounded-md text-red-900 bg-white hover:bg-red-900 hover:text-white transition-colors"
                                >
                                    Get Started →
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
