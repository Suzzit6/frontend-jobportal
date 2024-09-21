import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(UserContext); // Get user context

  // Define nav items based on user type
  const navItems =
    user?.accountType === "RECRUITER"
      ? [
          { path: "/", icon: "🏠", label: "My Created Jobs" },
          { path: "/create", icon: "➕", label: "Create Job" },
        ]
      : [
          { path: "/", icon: "🏠", label: "Home" },
          { path: "/profile", icon: "👤", label: "Profile" },
          { path: "/review", icon: "💼", label: "Review" },
          { path: "/applied", icon: "📝", label: "Applied" },
          { path: "/JobSearch", icon: "📝", label: "Job Search" }
        ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <ul>
        {navItems.map((item) => (
          <li
            key={item.path}
            className="mb-2"
          >
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
