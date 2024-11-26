import { useState } from 'react';

function ApplicationForm({ onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        coverLetter: '',
        cv: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('coverLetter', formData.coverLetter);
        if (formData.cv) {
            data.append('cv', formData.cv);
        }
        onSubmit(data);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'cv') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6" encType="multipart/form-data">
            <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-red-950">
                    Cover Letter
                </label>
                <div className="mt-1">
                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={4}
                        className="shadow-sm focus:ring-red-900 focus:border-red-900 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        required
                        placeholder="Tell us why you're the perfect fit for this position..."
                    />
                </div>
            </div>

            <div>
                <label htmlFor="cv" className="block text-sm font-medium text-red-950">
                    Resume/CV (PDF)
                </label>
                <div className="mt-1">
                    <input
                        type="file"
                        name="cv"
                        id="cv"
                        accept=".pdf"
                        onChange={handleChange}
                        className="shadow-sm focus:ring-red-900 focus:border-red-900 block w-full sm:text-sm border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-900 hover:file:bg-red-100"
                        required
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </form>
    );
}

export default ApplicationForm;