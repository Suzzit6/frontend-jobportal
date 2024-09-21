import React, { useEffect, useState } from 'react';
import ApplyJob from './ApplyJob';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async (searchParams = {}) => {
    setLoading(true); // Reset loading state
    setError(null); // Reset error state
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found, please login.');
      setLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const url = `http://localhost:3000/api/applicant/filter?${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Fixed template literal
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ title, location });
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Jobs</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title (e.g., Software Engineer)"
            className="flex-grow px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g., Mumbai)"
            className="flex-grow px-3 py-2 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Search Jobs
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded p-4 shadow-md">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-700">
              <strong>Company:</strong> {job.companyname}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {job.description}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="text-gray-700">
              <strong>Salary:</strong> ₹{job.salary}
            </p>
            <p className="text-gray-700">
              <strong>Recruiter:</strong> {job.recruiter.name}
            </p>
            <ApplyJob jobId={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
