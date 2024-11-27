import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import logoWhite from '../assets/elements/logo-white.png';

const Footer = () => {
    const { user } = useAuth();

    const renderLinks = () => {
        if (!user) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            <img 
                                src={logoWhite}
                                alt="CareNest"
                                className="h-8 w-auto mb-2"
                            />
                            CareNest
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Connecting healthcare professionals with meaningful opportunities in the UK healthcare sector.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Healthcare Professionals</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/browse-jobs" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Browse Healthcare Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Post Healthcare Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Create Employer Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Employer Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-300">
                                Email: support@carenest.com
                            </li>
                            <li className="text-gray-300">
                                Phone: (123) 456-7890
                            </li>
                            <li className="text-gray-300">
                                Hours: 24/7 Support
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }

        if (user.role === 'employer') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            <img 
                                src={logoWhite}
                                alt="CareNest"
                                className="h-8 w-auto mb-2"
                            />
                            CareNest
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Find exceptional healthcare professionals for your organization.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Manage Positions</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/dashboard" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    View Posted Positions
                                </Link>
                            </li>
                            <li>
                                <Link to="/post-job" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Post New Position
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Manage Applications
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/browse-jobs" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Browse All Positions
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Healthcare Recruitment Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                    Healthcare Regulations
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-300">
                                Email: employers@carenest.com
                            </li>
                            <li className="text-gray-300">
                                Phone: (123) 456-7890
                            </li>
                            <li className="text-gray-300">
                                Priority Support: 24/7
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }

        // Healthcare Professional view
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        <img 
                            src={logoWhite}
                            alt="CareNest"
                            className="h-8 w-auto mb-2"
                        />
                        CareNest
                    </h3>
                    <p className="text-gray-300 text-sm">
                        Your partner in finding the perfect healthcare role.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Job Search</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/browse-jobs" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                Browse Healthcare Jobs
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                Saved Positions
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                My Applications
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="#" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                Career Development
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                Interview Tips
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-300 hover:text-[#c92f42] transition-colors">
                                Healthcare Certifications
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="text-gray-300">
                            Email: support@carenest.com
                        </li>
                        <li className="text-gray-300">
                            Phone: (123) 456-7890
                        </li>
                        <li className="text-gray-300">
                            Hours: 24/7 Support
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <footer className="bg-red-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderLinks()}
                <div className="border-t border-white-700 mt-8 pt-8 text-center text-sm text-gray-300">
                    <p>&copy; {new Date().getFullYear()} CareNest. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
