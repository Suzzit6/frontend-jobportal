import React, { useState } from 'react';
import axios from 'axios';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');

  const handleFilter = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state on new search
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found, please login.');
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/applicant/filter", {
        params: { searchTerm },
        headers: { Authorization: `Bearer ${token}` }, // Fixed template literal
      });
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err.message || err);
      setError("Failed to fetch jobs. Please try again.");
    }
  };

  const applyForJob = async (jobId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setApplyMessage('You must be logged in to apply for a job.');
      return;
    }
    setApplyingJobId(jobId);
    setApplyMessage('');
    try {
      const response = await axios.post('http://localhost:3000/api/applicant/apply', 
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } } // Fixed template literal
      );
      setApplyMessage('Application successful');
    } catch (error) {
      console.error('Error applying for job:', error.message || error);
      setApplyMessage('An error occurred while applying.');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Search for jobs</h2>
      
      <div className="mb-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2">Browse all</button>

        
      </div>

      <form onSubmit={handleFilter} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="New search"
            className="flex-grow px-3 py-2 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Search Jobs
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        <h3 className="text-xl font-semibold mb-2">Job Results:</h3>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="border p-4 rounded-md shadow-md">
                <h4 className="text-lg font-semibold">{job.title}</h4>
                <p>Company: {job.companyname}</p>
                <p>Location: {job.location}</p>
                <p>Salary: ${job.salary}</p>
                <p>Recruiter: {job.recruiter.name}</p>
                <p>Description: {job.description}</p>
                <div className="mt-2">
                  <button
                    onClick={() => applyForJob(job.id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={applyingJobId === job.id}
                  >
                    {applyingJobId === job.id ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {applyMessage && <p className="mt-4 text-green-600">{applyMessage}</p>}
    </div>
  );
};

export default JobSearch; // Match the export with the component name
