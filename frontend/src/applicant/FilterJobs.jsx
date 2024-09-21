import React, { useState } from "react";
import axios from "axios";

const FilterJobs = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Single search term for search bar
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const handleFilter = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token

    if (!token) {
      setError('No token found, please login.');
      return;
    }

    try {
      // Make a GET request to the backend API with the JWT token and query params
      const response = await axios.get("http://localhost:3000/api/applicant/filter", {
        params: {
          searchTerm, // Pass the searchTerm in query params to filter by location, salary, or title
        },
        headers: {
          Authorization: `Bearer ${token}`, // Pass the JWT token in the Authorization header
        },
      });

      setJobs(response.data); // Set the fetched jobs
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching jobs:", err.message || err);
      setError("Failed to fetch jobs. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Jobs</h2>

      {/* Search Form */}
      <form onSubmit={handleFilter} className="space-y-4">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium">
            Search for jobs (e.g., Location, Salary, Title)
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Search Jobs
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Job Results */}
      <div className="mt-8">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterJobs;
