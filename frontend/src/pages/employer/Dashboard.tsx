import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getEmployerJobs } from "../../services/jobService";
import type { Job } from "../../types/types";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your job postings and view applications</p>
            </div>
            <button
              onClick={() => navigate("/employer/post-job")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{postedJobs.length}</div>
            <div className="text-gray-600">Total Jobs Posted</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {postedJobs.filter(job => job.status === "OPEN").length}
            </div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-red-600">
              {postedJobs.filter(job => job.status === "CLOSED").length}
            </div>
            <div className="text-gray-600">Closed Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {postedJobs.filter(job => new Date(job.deadline) < new Date()).length}
            </div>
            <div className="text-gray-600">Expired Deadlines</div>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
          </div>
          
          {postedJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-8.96-2.245m0 0A23.931 23.931 0 013 12c0-3.183.815-6.22 2.245-8.96m0 0a23.931 23.931 0 012.245 8.96c0 3.183-.815 6.22-2.245 8.96m0 0a23.931 23.931 0 018.96 2.245A23.931 23.931 0 0121 12c0-3.183-.815-6.22-2.245-8.96m0 0a23.931 23.931 0 00-2.245 8.96c0 3.183.815 6.22 2.245 8.96" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-6">Start attracting talent by posting your first job</p>
              <button
                onClick={() => navigate("/employer/post-job")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {postedJobs.map((job) => (
                <div key={job._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{job.location.city}, {job.location.country}</span>
                        <span>•</span>
                        <span className="capitalize">{job.jobType.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="capitalize">{job.jobSite}</span>
                        <span>•</span>
                        <span>{job.experienceLevel}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Posted: {formatDate(job.createdAt)}</span>
                        <span>•</span>
                        <span>Deadline: {formatDate(job.deadline)}</span>
                        {job.sector && (
                          <>
                            <span>•</span>
                            <span>Sector: {job.sector}</span>
                          </>
                        )}
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
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
                    <div className="flex items-center gap-3 ml-6">
                      <button
                        onClick={() => navigate(`/applications/job/${job._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Applications
                      </button>
                      <button
                        onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                      >
                        Edit
                      </button>
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
  