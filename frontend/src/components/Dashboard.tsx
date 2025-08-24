import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "../pages/admin/Dashboard";
import EmployerDashboard from "../pages/employer/Dashboard";
import ApplicantDashboard from "../pages/applicant/Dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "employer") return <EmployerDashboard />;
  return <ApplicantDashboard />;
}
