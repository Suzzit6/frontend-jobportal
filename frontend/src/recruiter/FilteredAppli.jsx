import React, { useState } from 'react';
import axios from 'axios';

const FilteredAppli = () => {
  const [jobId, setJobId] = useState('');
  const [percentage, setPercentage] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/recruiter/filteredapplicants`, // Keep as GET
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { // Use params to send query parameters
            jobId,
            percentage,
          },
        }
      );
      setApplicants(response.data.result);
    } catch (err) {
      setError('Failed to fetch applicants. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filtered Applicants</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Job ID"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Percentage"
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Filter Applicants'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {applicants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div key={applicant.applicantId} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">{applicant.personal_information.name}</h2>
              <p className="text-gray-600 mb-2">{applicant.personal_information.email}</p>
              <p className="text-gray-600 mb-2">{applicant.personal_information.location}</p>
              <p className="text-gray-600 mb-2">Contact: {applicant.personal_information.contact_number}</p>
              <p className="font-semibold mt-2">Suitability Rating: {applicant.suitability_rating}%</p>
              <p className="text-sm text-gray-700 mt-2">{applicant.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilteredAppli;
