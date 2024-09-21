import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./applicant/Home";
import Myprofile from "./applicant/Myprofile";
import CompaniesApplied from "./applicant/CompaniesApplied";
import ResumeRev from "./applicant/ResumeRev";
import MyCreatedJobs from "./recruiter/MyCreatedJobs";
import CreateJob from "./recruiter/CreateJob";
import ApplicantSidebar from "./applicant/ApplicantSidebar"; // Ensure correct path
import RecruiterSidebar from "./recruiter/RecruiterSidebar"; // Ensure correct path
import { UserContext } from "./context/UserContext";

const AuthenticatedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      {user.accountType === "Recruiter" ? (
        <RecruiterSidebar />
      ) : (
        <ApplicantSidebar />
      )}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Applicant Routes */}
        {user?.accountType === "Applicant" && (
          <>
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthenticatedRoute>
                  <Myprofile />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/applied"
              element={
                <AuthenticatedRoute>
                  <CompaniesApplied />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <AuthenticatedRoute>
                  <ResumeRev />
                </AuthenticatedRoute>
              }
            />
          </>
        )}

        {/* Recruiter Routes */}
        {user?.accountType === "Recruiter" && (
          <>
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <MyCreatedJobs />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <AuthenticatedRoute>
                  <CreateJob />
                </AuthenticatedRoute>
              }
            />
          </>
        )}

        {/* Redirect to login if no valid user */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
