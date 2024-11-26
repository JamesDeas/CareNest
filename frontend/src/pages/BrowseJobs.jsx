import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import debounce from 'lodash/debounce';
import JobCard from '../components/JobCard';

function BrowseJobs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        type: '',
        salaryMin: '',
        salaryMax: '',
        location: ''
    });

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];

    // Create a debounced search function
    const debouncedSearch = useMemo(
        () => debounce((searchQuery) => {
            if (searchQuery.trim()) {
                setSearchParams({ search: searchQuery.trim() });
            } else {
                setSearchParams({});
            }
        }, 300), // 300ms delay
        [setSearchParams]
    );

    const fetchJobs = async (searchQuery = '') => {
        try {
            setLoading(true);
            
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            // Add search term if exists
            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }
            
            // Add filters if they have values
            if (filters.type) {
                queryParams.append('type', filters.type);
            }
            
            if (filters.salaryMin) {
                queryParams.append('salaryMin', filters.salaryMin);
            }
            
            if (filters.salaryMax) {
                queryParams.append('salaryMax', filters.salaryMax);
            }
            
            if (filters.location) {
                queryParams.append('location', filters.location.trim());
            }

            // Make the API call with filters
            const response = await api.get(`/jobs?${queryParams.toString()}`);
            
            // Sort results if there's a search query
            if (searchQuery) {
                const sortedJobs = sortJobsByRelevance(response.data, searchQuery);
                setJobs(sortedJobs);
            } else {
                setJobs(response.data);
            }

            console.log('Applied filters:', filters); // Debug log
            console.log('Fetched jobs:', response.data); // Debug log
            
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    // Function to calculate relevance score for sorting
    const calculateRelevanceScore = (job, searchQuery) => {
        const searchLower = searchQuery.toLowerCase();
        let score = 0;

        // Exact matches get highest scores
        if (job.title.toLowerCase() === searchLower) score += 100;
        if (job.company.toLowerCase() === searchLower) score += 80;
        if (job.location.toLowerCase() === searchLower) score += 60;

        // Partial matches get lower scores
        if (job.title.toLowerCase().includes(searchLower)) score += 50;
        if (job.company.toLowerCase().includes(searchLower)) score += 40;
        if (job.location.toLowerCase().includes(searchLower)) score += 30;

        // Word boundary matches get bonus points
        const words = searchLower.split(/\s+/);
        words.forEach(word => {
            if (job.title.toLowerCase().split(/\s+/).includes(word)) score += 25;
            if (job.company.toLowerCase().split(/\s+/).includes(word)) score += 20;
            if (job.location.toLowerCase().split(/\s+/).includes(word)) score += 15;
        });

        return score;
    };

    // Function to sort jobs by relevance
    const sortJobsByRelevance = (jobs, searchQuery) => {
        return [...jobs].sort((a, b) => {
            const scoreA = calculateRelevanceScore(a, searchQuery);
            const scoreB = calculateRelevanceScore(b, searchQuery);
            return scoreB - scoreA;
        });
    };

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        const timeoutId = setTimeout(() => {
            fetchJobs(currentSearch);
        }, 300); // Add small delay to prevent too many requests

        return () => clearTimeout(timeoutId);
    }, [searchParams, filters.type, filters.salaryMin, filters.salaryMax, filters.location]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchParams({});
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = {
                ...prev,
                [name]: value
            };
            console.log('Updated filters:', newFilters); // Debug log
            return newFilters;
        });
    };

    const handleClearFilters = () => {
        setFilters({
            type: '',
            salaryMin: '',
            salaryMax: '',
            location: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Hero Search Section */}
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
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <h1 className="text-5xl font-bold text-center mb-6">
                        Browse All Jobs
                    </h1>
                    <p className="text-xl text-center mb-8 text-gray-100">
                        Find your next healthcare opportunity
                    </p>
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by title, company, or location..."
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-6 py-3 bg-white text-red-900 border border-red-900 rounded-lg hover:bg-red-900 hover:text-white transition-colors font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Jobs List Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    {/* Filter Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-medium text-red-950">Filter Jobs</h2>
                    </div>

                    {/* Filter Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Job Type Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Job Type
                                </label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-900 focus:ring-red-900 text-sm"
                                >
                                    <option value="">All Types</option>
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Salary Range Filters */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Minimum Salary
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">£</span>
                                    <input
                                        type="number"
                                        name="salaryMin"
                                        value={filters.salaryMin}
                                        onChange={handleFilterChange}
                                        placeholder="e.g., 30000"
                                        min="0"
                                        step="1000"
                                        className="w-full rounded-md border-gray-300 pl-8 shadow-sm focus:border-red-900 focus:ring-red-900 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Maximum Salary
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">£</span>
                                    <input
                                        type="number"
                                        name="salaryMax"
                                        value={filters.salaryMax}
                                        onChange={handleFilterChange}
                                        placeholder="e.g., 60000"
                                        min="0"
                                        step="1000"
                                        className="w-full rounded-md border-gray-300 pl-8 shadow-sm focus:border-red-900 focus:ring-red-900 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="e.g., London"
                                        className="w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-red-900 focus:ring-red-900 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(filters.type || filters.salaryMin || filters.salaryMax || filters.location) && (
                            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center px-4 py-2 border border-red-900 rounded-md shadow-sm text-sm font-medium text-red-900 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-700 text-center py-8 bg-red-50 rounded-lg">{error}</div>
                ) : (
                    <div className="mt-6 space-y-6">
                        {jobs.length === 0 ? (
                            <div className="text-center text-gray-500 bg-white rounded-lg py-8 shadow-sm">
                                No jobs found matching your criteria
                            </div>
                        ) : (
                            jobs.map(job => (
                                <JobCard 
                                    key={job._id} 
                                    job={job}
                                    isBrowsePage={true}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrowseJobs; 