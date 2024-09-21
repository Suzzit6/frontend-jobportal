import React, { useState, useEffect } from "react";
import axios from "axios";

const MyCreatedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To track selected job
  const [applicants, setApplicants] = useState([]); // To store applicants for the selected job
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch created jobs on component mount
  useEffect(() => {
    const fetchCreatedJobs = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found, please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/recruiter/mycreatedjobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJobs(response.data); // Set the jobs data in state
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch created jobs.");
        setLoading(false);
      }
    };

    fetchCreatedJobs();
  }, []);

  // Fetch applicants for the selected job
  const fetchApplicants = async (jobId) => {
    setLoading(true); // Show loading while fetching applicants
    const token = localStorage.getItem("jwtToken");

    try {
      // Make a GET request with jobId in the URL as a route parameter
      const response = await axios.get(
        `http://localhost:3000/api/recruiter/applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data.applicants); // Store applicants data
      setSelectedJob(response.data.job); // Store selected job data
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch applicants for the selected job.");
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Created Jobs</h1>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border p-4 rounded-md shadow cursor-pointer hover:bg-gray-100"
              onClick={() => fetchApplicants(job.id)} // Fetch applicants on click
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.companyname}</p>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-600">
                Salary: ₹{job.salary.toLocaleString()}
              </p>
              <p className="mt-2">{job.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>No jobs created yet.</div>
      )}

      {selectedJob && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            Applicants for {selectedJob.title}
          </h2>
          {applicants.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {applicants.map((applicant) => (
                <li
                  key={applicant.id}
                  className="border p-4 rounded-md shadow"
                >
                  <h3 className="text-xl font-semibold">{applicant.name}</h3>
                  <p className="text-gray-600">{applicant.email}</p>
                  <p className="text-gray-600">{applicant.bio}</p>
                  <p className="text-gray-600">
                    Skills: {applicant.skills.join(", ")}
                  </p>
                  <a
                    href={applicant.resume}
                    className="text-blue-500 hover:underline"
                  >
                    View Resume ({applicant.resumeOriginalName})
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div>No applicants for this job yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCreatedJobs;
