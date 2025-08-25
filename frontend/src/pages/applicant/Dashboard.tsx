import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserApplications } from "../../services/applicationService";
import type { Application } from "../../types/types";
import LogoutButton from "../../components/LogoutButton";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const userApplications = await getUserApplications();
      setApplications(userApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Application["status"]) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  /** ----------------------------
   * HELPER METHODS FOR JOB DETAILS
   * ---------------------------- */

  const getCountryCity = (application: Application) => {
    if (typeof application.jobId !== "string") {
      return `${application.jobId.location.country}, ${application.jobId.location.city}`;
    }
    if (application.job?.location) {
      return `${application.job.location.country}, ${application.job.location.city}`;
    }
    return "N/A";
  };

  const getJobType = (application: Application) => {
    if (typeof application.jobId !== "string") {
      return application.jobId.jobType?.replace("_", " ") || "N/A";
    }
    return application.job?.jobType?.replace("_", " ") || "N/A";
  };

  const getJobSite = (application: Application) => {
    if (typeof application.jobId !== "string") {
      return application.jobId.jobSite || "N/A";
    }
    return application.job?.jobSite || "N/A";
  };

  const getJobId = (application: Application) => {
    if (typeof application.jobId === "string") {
      return application.jobId;
    }
    return application.jobId._id;
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-2">Track your job applications and career progress</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/jobs")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse More Jobs
              </button>
              <LogoutButton variant="ghost" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.status === "applied").length}
            </div>
            <div className="text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.status === "shortlisted").length}
            </div>
            <div className="text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(app => app.status === "rejected").length}
            </div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Applications by Status */}
        <div className="space-y-8">
          {/* Applied */}
          {applications.filter(app => app.status === "applied").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Review</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {applications
                  .filter(app => app.status === "applied")
                  .map((application) => (
                    <div key={application._id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {typeof application.jobId === "string" ? (application.job?.title || "Job Title Not Available") : application.jobId.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{getCountryCity(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobType(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobSite(application)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                            {application.coverLetter && (
                              <span>• Cover letter included</span>
                            )}
                            {application.resumeUrl && (
                              <span>• Resume uploaded</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                          <button
                            onClick={() => navigate(`/job/${getJobId(application)}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Job
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Shortlisted */}
          {applications.filter(app => app.status === "shortlisted").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shortlisted</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {applications
                  .filter(app => app.status === "shortlisted")
                  .map((application) => (
                    <div key={application._id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {typeof application.jobId === "string" ? (application.job?.title || "Job Title Not Available") : application.jobId.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{getCountryCity(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobType(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobSite(application)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                            <span>• Shortlisted: {new Date(application.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                          <button
                            onClick={() => navigate(`/job/${getJobId(application)}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Job
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Rejected */}
          {applications.filter(app => app.status === "rejected").length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Not Selected</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {applications
                  .filter(app => app.status === "rejected")
                  .map((application) => (
                    <div key={application._id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {typeof application.jobId === "string" ? (application.job?.title || "Job Title Not Available") : application.jobId.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{getCountryCity(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobType(application)}</span>
                            <span>•</span>
                            <span className="capitalize">{getJobSite(application)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                            <span>• Rejected: {new Date(application.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                          <button
                            onClick={() => navigate(`/job/${getJobId(application)}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Job
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* No Applications */}
          {applications.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-6">Start your job search by browsing available positions</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/jobs")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </button>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
