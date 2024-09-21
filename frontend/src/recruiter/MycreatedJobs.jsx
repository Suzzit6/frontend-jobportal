import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageDialog from "./MessageDialog"; // Import the dialog component

const MyCreatedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [percentage, setPercentage] = useState("");

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
        setJobs(response.data);
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
    setLoading(true);
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/recruiter/applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data.applicants);
      setSelectedJob(response.data.job);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch applicants for the selected job.");
      setLoading(false);
    }
  };
  const handlleFilterCandidates = async (jobId, percentage) => {
    setLoading(true); // Show loading while fetching applicants
    const token = localStorage.getItem("jwtToken");

    try {
      // Make a GET request with jobId in the URL as a route parameter
      const response = await axios.get(
        `http://localhost:3000/api/recruiter/filteredapplicants/${jobId}/${percentage}`,
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

  const handleSendMessage = async (applicantId, message) => {
    const token = localStorage.getItem("jwtToken");

    try {
      await axios.post(
        `http://localhost:3000/api/recruiter/message/${applicantId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Message sent successfully!"); // Simple feedback for the user
    } catch (error) {
      alert("Failed to send message.");
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
              onClick={() => fetchApplicants(job.id)}
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>

              <p className="text-gray-600">id : {job.id}</p>
              <p className="text-gray-600">{job.companyname}</p>

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

      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border p-4 rounded-md shadow cursor-pointer hover:bg-gray-100"
              onClick={() => fetchApplicants(job.id)}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Applicants for {selectedJob.title}
            </h2>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition duration-200"
            >
              Filter Candidates
            </button>
          </div>
          {applicants.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {applicants.map((applicant) => (
                <li key={applicant.id} className="border p-4 rounded-md shadow">
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
                  <button
                    className="ml-4 bg-blue-500 text-white p-2 rounded"
                    onClick={() => {
                      setCurrentApplicant(applicant);
                      setIsDialogOpen(true);
                    }}
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>No applicants for this job yet.</div>
          )}
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-2xl">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h3 className="text-xl font-semibold mb-4">Enter Percentage</h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="percentage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Percentage
                </label>
                <input
                  type="number"
                  id="percentage"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCreatedJobs;
