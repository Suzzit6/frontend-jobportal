import React, { useState } from 'react';


const ApplyJob = ({ jobId }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const applyForJob = async () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setMessage('You must be logged in to apply for a job.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/applicant/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token for authentication
        },
        body: JSON.stringify({ jobId }), // Sending jobId in the body
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Application successful');
      } else {
        setMessage(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Error applying for job:', error.message || error);
      setMessage('An error occurred while applying.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={applyForJob}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loading}
      >
        {loading ? 'Applying...' : 'Apply for Job'}
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
};

export default ApplyJob;
