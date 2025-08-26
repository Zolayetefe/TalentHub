import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getEmployerJobs, closeJob, updateJob } from "../../services/jobService";
import type { Job } from "../../types/types";
import LogoutButton from "../../components/LogoutButton";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingJobId, setActingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPostedJobs();
    }
  }, [user]);

  const fetchPostedJobs = async () => {
    try {
      const userJobs = await getEmployerJobs(user!.id);
      setPostedJobs(userJobs);
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: Job["status"]) => {
    return status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleClose = async (jobId: string) => {
    setActingJobId(jobId);
    try {
      const updated = await closeJob(jobId);
      setPostedJobs(prev => prev.map(j => (j._id === jobId ? updated : j)));
    } catch (error) {
      console.error("Error closing job:", error);
    } finally {
      setActingJobId(null);
    }
  };

  const handleReopen = async (jobId: string) => {
    setActingJobId(jobId);
    try {
      const updated = await updateJob(jobId, { status: "OPEN" });
      setPostedJobs(prev => prev.map(j => (j._id === jobId ? updated : j)));
    } catch (error) {
      console.error("Error reopening job:", error);
    } finally {
      setActingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-base sm:text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Employer Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your job postings and view applications</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/employer/post-job")}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm touch-manipulation"
              >
                Post New Job
              </button>
              <LogoutButton variant="ghost" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg sm:text-xl font-bold text-blue-600">{postedJobs.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Jobs Posted</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {postedJobs.filter(job => job.status === "OPEN").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg sm:text-xl font-bold text-red-600">
              {postedJobs.filter(job => job.status === "CLOSED").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Closed Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg sm:text-xl font-bold text-yellow-600">
              {postedJobs.filter(job => new Date(job.deadline) < new Date()).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Expired Deadlines</div>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Job Postings</h2>
          </div>
          
          {postedJobs.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-8.96-2.245m0 0A23.931 23.931 0 013 12c0-3.183.815-6.22 2.245-8.96m0 0a23.931 23.931 0 012.245 8.96c0 3.183-.815 6.22-2.245 8.96m0 0a23.931 23.931 0 018.96 2.245A23.931 23.931 0 0121 12c0-3.183-.815-6.22-2.245-8.96m0 0a23.931 23.931 0 00-2.245 8.96c0 3.183.815 6.22 2.245 8.96" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Start attracting talent by posting your first job</p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate("/employer/post-job")}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm touch-manipulation"
                >
                  Post Your First Job
                </button>
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {postedJobs.map((job) => (
                <div key={job._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        <span>{job.location.city}, {job.location.country}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">{job.jobType.replace("_", " ")}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">{job.jobSite}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{job.experienceLevel}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                        <span>Posted: {formatDate(job.createdAt)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Deadline: {formatDate(job.deadline)}</span>
                        {job.sector && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>Sector: {job.sector}</span>
                          </>
                        )}
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="text-gray-500 text-xs">+{job.skills.length - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0 sm:ml-4">
                      <button
                        onClick={() => navigate(`/applications/job/${job._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium touch-manipulation"
                      >
                        View Applications
                      </button>
                      {job.status === "OPEN" ? (
                        <button
                          onClick={() => handleClose(job._id)}
                          disabled={actingJobId === job._id}
                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium disabled:opacity-50 touch-manipulation"
                        >
                          {actingJobId === job._id ? "Closing..." : "Close"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopen(job._id)}
                          disabled={actingJobId === job._id}
                          className="text-green-600 hover:text-green-800 text-xs sm:text-sm font-medium disabled:opacity-50 touch-manipulation"
                        >
                          {actingJobId === job._id ? "Reopening..." : "Reopen"}
                        </button>
                      )}
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