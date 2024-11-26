import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img 
                                src="/elements/logo-red.png"
                                alt="CareNest"
                                className="h-8 w-auto"
                            />
                            <h1 className="ml-2 text-xl font-bold text-[#c92f42]">CareNest</h1>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/browse-jobs"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#c92f42]"
                            >
                                Browse Jobs
                            </Link>
                            {user && (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#c92f42]"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-4 relative">
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#c92f42]"
                                    >
                                        <span>{user.name}</span>
                                        <svg 
                                            className="h-5 w-5" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7" 
                                            />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div 
                                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                                            onBlur={() => setDropdownOpen(false)}
                                        >
                                            <div className="py-1">
                                                <Link
                                                    to="/account-settings"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Account Settings
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-3 py-2 border border-[#c92f42] text-sm font-medium rounded-md text-[#c92f42] bg-white hover:bg-[#c92f42] hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c92f42] hover:bg-[#b52a3c] transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#c92f42] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#c92f42]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon */}
                            <svg
                                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/browse-jobs"
                        className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                    >
                        Browse Jobs
                    </Link>
                    {user && (
                        <>
                            <Link
                                to="/dashboard"
                                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/account-settings"
                                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                            >
                                Account Settings
                            </Link>
                            <button
                                onClick={logout}
                                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link
                                to="/login"
                                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-[#c92f42] hover:bg-gray-50"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
