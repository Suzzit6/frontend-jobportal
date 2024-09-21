import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeRev = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not authenticated. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/applicant/resumeReview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResumeData(response.data); // Set the data in the state
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch resume data.');
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [navigate]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Review</h1>
      {resumeData && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Domain:</h2>
            <p>{resumeData.domain}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Experience:</h2>
            <p>{resumeData.experience_years} years</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Review:</h2>
            <p>{resumeData.Review}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Location:</h2>
            <p>{resumeData.location}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Skills:</h2>
            <ul className="list-disc pl-6">
              {resumeData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Education:</h2>
            <p>{resumeData.education}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Expected Salary:</h2>
            <p>{resumeData.salary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeRev;
