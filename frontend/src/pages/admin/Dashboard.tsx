import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllJobs, closeJob, updateJob, deleteJob } from "../../services/jobService";
import type { Job } from "../../types/types";
import LogoutButton from "../../components/LogoutButton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Job["status"]>("ALL");
  const [search, setSearch] = useState("");
  const [actingJobId, setActingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const all = await getAllJobs();
        setJobs(all);
      } catch (e) {
        setError("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const filteredJobs = useMemo(() => {
    let data = jobs;
    if (statusFilter !== "ALL") data = data.filter(j => j.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.location.city.toLowerCase().includes(q) ||
        j.location.country.toLowerCase().includes(q) ||
        (j.sector?.toLowerCase().includes(q) ?? false)
      );
    }
    return data;
  }, [jobs, statusFilter, search]);

  const totalOpen = jobs.filter(j => j.status === "OPEN").length;
  const totalClosed = jobs.filter(j => j.status === "CLOSED").length;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handleClose = async (jobId: string) => {
    setActingJobId(jobId);
    try {
      const updated = await closeJob(jobId);
      setJobs(prev => prev.map(j => (j._id === jobId ? updated : j)));
      console.log("Updated job:", updated);

    } finally {
      setActingJobId(null);
    }
  };

  const handleReopen = async (jobId: string) => {
    setActingJobId(jobId);
    try {
      const updated = await updateJob(jobId, { status: "OPEN" });
      setJobs(prev => prev.map(j => (j._id === jobId ? updated : j)));
      console.log("Updated job:", updated);

    } finally {
      setActingJobId(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    setActingJobId(jobId);
    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } finally {
      setActingJobId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl">Access denied. Admins only.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all job postings and view applicants</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, city, country, sector"
                className="flex-1 sm:flex-none sm:w-72 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
              <LogoutButton variant="ghost" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
            <div className="text-gray-600">Total Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">{totalOpen}</div>
            <div className="text-gray-600">Open</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-red-600">{totalClosed}</div>
            <div className="text-gray-600">Closed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">{jobs.filter(j => new Date(j.deadline) < new Date()).length}</div>
            <div className="text-gray-600">Past Deadline</div>
          </div>
        </div>

        {/* Jobs list */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">All Job Postings</h2>
            <span className="text-sm text-gray-600">{filteredJobs.length} results</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <div className="mb-4">No jobs match the current filters.</div>
              <LogoutButton />
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map(job => (
                <div key={job._id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
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
                          {job.skills.slice(0, 6).map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{skill}</span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="text-gray-500 text-xs">+{job.skills.length - 6} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 md:ml-6">
                      {/* <button
                        onClick={() => navigate(`/applications/job/${job._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Applications
                      </button> */}
                      {job.status === "OPEN" ? (
                        <button
                          onClick={() => handleClose(job._id)}
                          disabled={actingJobId === job._id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >
                          {actingJobId === job._id ? "Closing..." : "Close"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopen(job._id)}
                          disabled={actingJobId === job._id}
                          className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                        >
                          {actingJobId === job._id ? "Reopening..." : "Reopen"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={actingJobId === job._id}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium disabled:opacity-50"
                      >
                        {actingJobId === job._id ? "Deleting..." : "Delete"}
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
  


  