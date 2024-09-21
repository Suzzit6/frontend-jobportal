import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompaniesApplied = () => {
  const [companies, setCompanies] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompaniesApplied = async () => {
      const token = localStorage.getItem('jwtToken'); // Ensure this key matches the token storage

      if (!token) {
        setError('No token found, please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/applicant/applied', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure response.data is what you expect (an array of companies)
        if (Array.isArray(response.data)) {
          setCompanies(response.data);
        } else {
          throw new Error('Invalid response format');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        let errorMessage = 'An error occurred while fetching data.';

        if (error.response) {
          errorMessage = `Server Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'No response received from server. Please check your network connection.';
        } else {
          errorMessage = error.message;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchCompaniesApplied();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Companies Applied To</h1>
      {companies.length === 0 ? (
        <p className="text-center py-4">No applications found</p>
      ) : (
        <ul className="space-y-4">
          {companies.map((company, index) => (
            <li key={index} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold">{company.companyName}</h2>
              <p><strong>Job Title:</strong> {company.jobTitle}</p>
              <p><strong>Salary:</strong> ${company.salary?.toLocaleString()}</p>
              <p><strong>Status:</strong> {company.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompaniesApplied;
