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
import FilterJobs from "./applicant/FilterJobs";
import { UserContext } from "./context/UserContext";
import JobSearch from "./applicant/JobSearch";
import FilteredAppli from "./recruiter/FilteredAppli";

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
              path="/job"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Myprofile />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/filter"
              element={
                <AuthenticatedRoute>
                  <FilterJobs />
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
            <Route
              path="/JobSearch"
              element={
                <AuthenticatedRoute>
                  <JobSearch/>
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
            <Route
              path="/filtered"
              element={
                <AuthenticatedRoute>
                  <FilteredAppli/>
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
