import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Jobs from "../pages/Jobs";
import JobDetail from "../pages/JobDetail";
import EmployerPostJob from "../pages/employer/PostJob";
import {JobApplications } from "../pages/employer/JobApplications";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Public auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/job/:id" element={<JobDetail />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Employer routes */}
      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute allowedRoles={["employer", "admin"]}>
            <EmployerPostJob />
          </ProtectedRoute>
        }
      />

      {/* Application routes */}
      <Route
        path="/applications/job/:jobId"
        element={
          <ProtectedRoute allowedRoles={["employer", "admin"]}>
            <JobApplications />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
