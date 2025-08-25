import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getJobById, closeJob } from "../../services/jobService";
import { getJobApplications, updateApplicationStatus } from "../../services/applicationService";
import type { Job, Application } from "../../types/types";

export function JobApplications() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [closingJob, setClosingJob] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobData, applicationsData] = await Promise.all([
        getJobById(jobId!),
        getJobApplications(jobId!)
      ]);
      setJob(jobData);
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      const updatedApplications = await getJobApplications(jobId!);
      setApplications(updatedApplications);
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCloseJob = async () => {
    if (!job) return;
    
    setClosingJob(true);
    try {
      await closeJob(job._id);
      const updatedJob = await getJobById(jobId!);
      setJob(updatedJob);
    } catch (error) {
      console.error("Error closing job:", error);
    } finally {
      setClosingJob(false);
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

  const getUserName = (application: Application) => {
    if (application.userId === null) {
      return 'Unknown Applicant';
    }
    if (typeof application.userId === 'string') {
      return application.user?.name || 'Unknown Applicant';
    }
    return application.userId.name;
  };

  const getUserEmail = (application: Application) => {
    if (application.userId === null) {
      return 'N/A';
    }
    if (typeof application.userId === 'string') {
      return application.user?.email || 'N/A';
    }
    return application.userId.email;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg sm:text-xl">Job not found</div>
      </div>
    );
  }

  if (user?.role !== "employer" && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg sm:text-xl text-center px-4">Access denied. Only employers can view applications.</div>
      </div>
    );
  }

  if (job.createdBy !== user?.id && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg sm:text-xl text-center px-4">Access denied. You can only view applications for your own job postings.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2 text-sm sm:text-base"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600 text-sm sm:text-base">Applications: {applications.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Job Status</div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {job.status}
              </span>
              {job.status === "OPEN" && (
                <button
                  onClick={handleCloseJob}
                  disabled={closingJob}
                  className="mt-3 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {closingJob ? "Closing..." : "Close Job"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Applications</h2>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 text-sm sm:text-base">This job hasn't received any applications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {getUserName(application)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Email</div>
                          <div className="font-medium text-sm sm:text-base">{getUserEmail(application)}</div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-600">Applied Date</div>
                          <div className="font-medium text-sm sm:text-base">{formatDate(application.createdAt)}</div>
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-4">
                          <div className="text-xs sm:text-sm text-gray-600 mb-2">Cover Letter</div>
                          <div className="bg-gray-50 p-3 rounded-lg text-xs sm:text-sm">
                            {application.coverLetter}
                          </div>
                        </div>
                      )}

                      {application.resumeUrl && (
                        <div className="mb-4">
                          <div className="text-xs sm:text-sm text-gray-600 mb-2">Resume</div>
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Resume →
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:ml-6">
                      <div className="text-xs sm:text-sm text-gray-600">Update Status</div>
                      <div className="flex flex-row sm:flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(application._id, "shortlisted")}
                          disabled={updatingStatus === application._id || application.status === "shortlisted"}
                          className={`px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                            application.status === "shortlisted"
                              ? "bg-yellow-200 text-yellow-800 cursor-not-allowed"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {updatingStatus === application._id ? "Updating..." : "Shortlist"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, "rejected")}
                          disabled={updatingStatus === application._id || application.status === "rejected"}
                          className={`px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                            application.status === "rejected"
                              ? "bg-red-200 text-red-800 cursor-not-allowed"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {updatingStatus === application._id ? "Updating..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobApplications;