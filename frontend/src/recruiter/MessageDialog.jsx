import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const MessageDialog = ({ isOpen, onClose, applicant }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

    try {
      const response = await axios.post(
        "http://localhost:3000/api/recruiter/messageApplicant",
        {
          email: applicant.email,
          messageContent: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      alert(response.data.message || "Message sent successfully!"); // Show success message
      setMessage(""); // Clear the message input
      onClose(); // Close the dialog
    } catch (err) {
      // Catch errors
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // If the dialog is not open, return null to render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">
          Send Message to {applicant.name}
        </h2>
        {error && <div className="text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-24 p-2 border rounded"
            required
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MessageDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  applicant: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageDialog;
