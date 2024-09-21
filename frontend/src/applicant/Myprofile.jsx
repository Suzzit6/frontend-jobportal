import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    resume: "",
    resumeOriginalName: "",
    profilePhoto: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/applicant/profileinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setError("Failed to load profile information.");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setUpdatedProfile({
      ...updatedProfile,
      skills,
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/applicant/update",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(updatedProfile);
      setEditMode(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <img
            src={
              profile.profilePhoto
                ? profile.profilePhoto
                : "https://photos.wellfound.com/users/17198458-medium_jpg?1721848528" // Fallback image if URL is missing
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6 object-cover" // Added object-cover for better fit
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://photos.wellfound.com/users/17198458-medium_jpg?1721848528"; // Fallback if image fails to load
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Looking for</h2>
          <p>{profile.bio}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Resume</h2>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {profile.resumeOriginalName}
          </a>
        </div>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block">Bio:</label>
              <textarea
                name="bio"
                value={updatedProfile.bio}
                onChange={handleChange}
                className="border p-2 w-full"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block">Skills (comma-separated):</label>
              <input
                type="text"
                name="skills"
                value={updatedProfile.skills.join(", ")}
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
              {loading ? "Saving..." : "Save Changes"}
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

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default MyProfile;
