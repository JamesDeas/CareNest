import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateJob = () => {
  const { id } = useParams(); // Get job ID from the URL
  const navigate = useNavigate(); // For navigation

  const [job, setJob] = useState({
    title: "",
    description: "",
    salary: "",
    company: "",
    location: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch job details for editing
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/jobs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const jobData = await response.json();
        setJob(jobData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) throw new Error("Failed to update job");

      alert("Job updated successfully!");
      navigate(`/job-details/${id}`); // Redirect to job details after update
    } catch (err) {
      alert("Error updating job: " + err.message);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Update Job</h1>

      <form onSubmit={handleUpdate}>
        <label className="block mb-2">
          Title:
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Description:
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Salary:
          <input
            type="number"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Company:
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Location:
          <input
            type="text"
            name="location"
            value={job.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <label className="block mb-4">
          Job Type:
          <input
            type="text"
            name="type"
            value={job.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </label>

        <div className="flex space-x-4">

            {/* Go Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Job
          </button>

          
        </div>
      </form>
    </div>
  );
};

export default UpdateJob;

