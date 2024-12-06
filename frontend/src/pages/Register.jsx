import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'jobseeker'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [consent, setConsent] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleConsentChange = (e) => {
        setConsent(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!consent) {
            setError('You must agree to the GDPR policy to register.');
            setLoading(false);
            return;
        }

        try {
            console.log('Sending registration request:', formData);
            const response = await api.post('/auth/register', formData);
            console.log('Registration response:', response.data);
            
            // Login the user
            login(response.data.user, response.data.token);
            
            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-16 pb-16 bg-gray-50">
            {/* Content */}
            <div className="mt-8 mb-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-10 px-6 shadow-lg sm:rounded-lg sm:px-12 border border-gray-100">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-700 focus:border-red-700"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-700 focus:border-red-700"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-700 focus:border-red-700"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                I am a
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-700 focus:border-red-700"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="jobseeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="consent"
                                name="consent"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                checked={consent}
                                onChange={handleConsentChange}
                            />
                            <label htmlFor="consent" className="ml-2 block text-sm text-gray-900">
                                I agree to the <a href="/gdpr" className="text-red-600 hover:text-red-500">GDPR policy</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register; 