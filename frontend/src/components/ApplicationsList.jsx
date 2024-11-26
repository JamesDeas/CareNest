import { useState } from 'react';

const ApplicationsList = ({ applications, onUpdateStatus, onDownloadCV }) => {
    return (
        <div className="space-y-4">
            {applications.map(application => (
                <div 
                    key={application._id} 
                    className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <h3 className="text-lg font-medium text-red-950">
                                {application.applicant.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {application.applicant.email}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={application.status}
                                onChange={(e) => onUpdateStatus(application._id, e.target.value)}
                                className="rounded-md border-gray-300 text-sm focus:ring-red-900 focus:border-red-900 pr-8"
                            >
                                <option value="pending" className="text-yellow-600">Pending</option>
                                <option value="reviewed" className="text-blue-600">Reviewed</option>
                                <option value="accepted" className="text-green-600">Accepted</option>
                                <option value="rejected" className="text-red-600">Rejected</option>
                            </select>
                            
                            <button
                                onClick={() => onDownloadCV(application._id)}
                                className="inline-flex items-center px-3 py-2 border border-red-900 text-sm font-medium rounded-md text-red-900 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
                            >
                                <svg 
                                    className="h-4 w-4 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Download CV
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApplicationsList;