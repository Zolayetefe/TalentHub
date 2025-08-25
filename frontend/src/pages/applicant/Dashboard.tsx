import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserApplications } from "../../services/applicationService";
import { getAllJobs } from "../../services/jobService";
import type { Application, Job } from "../../types/types";
import LogoutButton from "../../components/LogoutButton";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");

  // Jobs tab filters
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("");
  const [jobSiteFilter, setJobSiteFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [userApplications, allJobs] = await Promise.all([
        getUserApplications(),
        getAllJobs(),
      ]);
      setApplications(userApplications);
      setJobs(allJobs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter(job => {
      const matchesSearch = !q ||
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.location.city.toLowerCase().includes(q) ||
        job.location.country.toLowerCase().includes(q) ||
        (job.skills?.some(s => s.toLowerCase().includes(q)) ?? false) ||
        (job.sector?.toLowerCase().includes(q) ?? false);
      const matchesType = jobTypeFilter ? job.jobType === jobTypeFilter : true;
      const matchesSite = jobSiteFilter ? job.jobSite === jobSiteFilter : true;
      const matchesExp = experienceFilter ? job.experienceLevel === experienceFilter : true;
      return matchesSearch && matchesType && matchesSite && matchesExp;
    });
  }, [jobs, searchQuery, jobTypeFilter, jobSiteFilter, experienceFilter]);

  const clearJobFilters = () => {
    setSearchQuery("");
    setJobTypeFilter("");
    setJobSiteFilter("");
    setExperienceFilter("");
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

  const getJobTitle = (application: Application) => {
    if (application.jobId === null) {
      return "Job Title Not Available";
    }
    if (typeof application.jobId !== "string") {
      return application.jobId.title || "Job Title Not Available";
    }
    return application.job?.title || "Job Title Not Available";
  };

  const getCountryCity = (application: Application) => {
    if (application.jobId === null) {
      return "N/A";
    }
    if (typeof application.jobId !== "string") {
      return `${application.jobId.location?.country || "N/A"}, ${application.jobId.location?.city || "N/A"}`;
    }
    if (application.job?.location) {
      return `${application.job.location.country}, ${application.job.location.city}`;
    }
    return "N/A";
  };

  const getJobType = (application: Application) => {
    if (application.jobId === null) {
      return "N/A";
    }
    if (typeof application.jobId !== "string") {
      return application.jobId.jobType?.replace("_", " ") || "N/A";
    }
    return application.job?.jobType?.replace("_", " ") || "N/A";
  };

  const getJobSite = (application: Application) => {
    if (application.jobId === null) {
      return "N/A";
    }
    if (typeof application.jobId !== "string") {
      return application.jobId.jobSite || "N/A";
    }
    return application.job?.jobSite || "N/A";
  };

  const getJobId = (application: Application) => {
    if (application.jobId === null) {
      return "N/A";
    }
    if (typeof application.jobId === "string") {
      return application.jobId;
    }
    return application.jobId._id;
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

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
              <p className="text-gray-600 mt-2">Explore jobs and track your applications</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab(activeTab === "jobs" ? "applications" : "jobs")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {activeTab === "jobs" ? "View My Applications" : "Browse Jobs"}
              </button>
              <LogoutButton variant="ghost" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-4 py-2 rounded ${activeTab === "jobs" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 rounded ${activeTab === "applications" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              My Applications
            </button>
          </div>
        </div>

        {activeTab === "jobs" ? (
          // Jobs list view
          <div className="space-y-8">
            {/* Filters/Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by title, location, sector, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">All Job Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
                <select
                  value={jobSiteFilter}
                  onChange={(e) => setJobSiteFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">All Work Types</option>
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">All Experience Levels</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid-level</option>
                  <option value="SENIOR">Senior</option>
                </select>
              </div>
              <div className="mt-4">
                <button onClick={clearJobFilters} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Clear Filters</button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
                <div className="text-gray-600">Matching Jobs</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-green-600">{filteredJobs.filter(j => j.status === "OPEN").length}</div>
                <div className="text-gray-600">Open</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-purple-600">{filteredJobs.filter(j => new Date(j.deadline) >= new Date()).length}</div>
                <div className="text-gray-600">Active Deadlines</div>
              </div>
            </div>

            {/* Jobs grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-600">No jobs match your criteria.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <div key={job._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow transition">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{job.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      <span>{job.location.country}, {job.location.city}</span>
                      <span>•</span>
                      <span className="capitalize">{job.jobType.replace("_", " ")}</span>
                      <span>•</span>
                      <span className="capitalize">{job.jobSite}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>Posted: {formatDate(job.createdAt)}</span>
                      <span>•</span>
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/job/${job._id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                      <button onClick={() => navigate(`/job/${job._id}`)} className="text-green-600 hover:text-green-800 text-sm font-medium">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Applications view
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                <div className="text-gray-600">Total Applications</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-blue-600">{applications.filter(app => app.status === "applied").length}</div>
                <div className="text-gray-600">Pending Review</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-yellow-600">{applications.filter(app => app.status === "shortlisted").length}</div>
                <div className="text-gray-600">Shortlisted</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-2xl font-bold text-red-600">{applications.filter(app => app.status === "rejected").length}</div>
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
                          <div className="flex justify_between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {getJobTitle(application)}
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
                                {application.coverLetter && (<span>• Cover letter included</span>)}
                                {application.resumeUrl && (<span>• Resume uploaded</span>)}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>{getStatusText(application.status)}</span>
                              <button onClick={() => navigate(`/job/${getJobId(application)}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Job</button>
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
                          <div className="flex justify_between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {getJobTitle(application)}
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
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>{getStatusText(application.status)}</span>
                              <button onClick={() => navigate(`/job/${getJobId(application)}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Job</button>
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
                          <div className="flex justify_between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {getJobTitle(application)}
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
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>{getStatusText(application.status)}</span>
                              <button onClick={() => navigate(`/job/${getJobId(application)}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Job</button>
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
                    <button onClick={() => setActiveTab("jobs")} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Browse Jobs</button>
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
