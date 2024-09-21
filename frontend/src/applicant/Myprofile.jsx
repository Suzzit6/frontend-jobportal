import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    skills: [],
    resume: '',
    resumeOriginalName: '',
    profilePhoto: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  console.log("token")
  useEffect(() => {
    // Fetch the profile information with JWT token in headers
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwtToken'); // Get the token from localStorage
      if (!token) {
        setError('User is not authenticated. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/applicant/profileinfo', 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile info:', error);
        setError('Failed to load profile information.');
        if (error.response && error.response.status === 401) {
          navigate('/login'); // Navigate to login if token is invalid
        }
      }
    };

    fetchProfile();
  }, []);

  // Handle input change for editing fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  // Handle skills change as array input
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map((skill) => skill.trim());
    setUpdatedProfile({
      ...updatedProfile,
      skills,
    });
  };

  // Submit the updated profile with JWT token in headers
  const handleSubmit = async () => {
    const token = localStorage.getItem('jwtToken'); // Get the token from localStorage
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/applicant/update', updatedProfile, {
        headers: {
          Authorization:`Bearer ${token}`, // Add token to request headers
        },
      });
      setProfile(updatedProfile); // Update the profile state after success
      setEditMode(false);
      setSuccess('Profile updated successfully.');
    } 
    catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Applicant Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Skills:</strong> {profile.skills.length > 0 ? profile.skills.join(', ') : 'No skills added'}</p>
          <p><strong>Resume:</strong> <a href={profile.resume} target="_blank" rel="noopener noreferrer">{profile.resumeOriginalName}</a></p>
          <img src={profile.profilePhoto} alt="Profile" className="mt-4 w-32 h-32 rounded-full" />
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block">Bio:</label>
            <input
              type="text"
              name="bio"
              value={updatedProfile.bio}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Skills (comma-separated):</label>
            <input
              type="text"
              name="skills"
              value={updatedProfile.skills.join(', ')}
              onChange={handleSkillsChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Resume URL:</label>
            <input
              type="text"
              name="resume"
              value={updatedProfile.resume}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Resume Original Name:</label>
            <input
              type="text"
              name="resumeOriginalName"
              value={updatedProfile.resumeOriginalName}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Profile Photo URL:</label>
            <input
              type="text"
              name="profilePhoto"
              value={updatedProfile.profilePhoto}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;