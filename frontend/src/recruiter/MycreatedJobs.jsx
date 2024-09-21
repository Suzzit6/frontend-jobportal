import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageDialog from "./MessageDialog"; // Import the dialog component

const MyCreatedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);

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

      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSend={handleSendMessage}
        applicant={currentApplicant}
      />
    </div>
  );
};

export default MyCreatedJobs;
