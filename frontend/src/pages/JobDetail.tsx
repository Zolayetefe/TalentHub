import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";
import type { Job } from "../types/types";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      if (!id) return;
      const jobData = await getJobById(id);
      setJob(jobData);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job || !user) return;
    
    setApplying(true);
    try {
      await applyForJob({
        jobId: job._id,
        coverLetter,
        resumeUrl: resumeUrl || undefined,
      });
      setShowApplyModal(false);
      setCoverLetter("");
      setResumeUrl("");
      // Redirect to dashboard to see applied jobs
      navigate("/dashboard");
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-xl">Job not found</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
  <div className="flex justify-between items-start mb-4">
    <div>
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
      <div className="flex items-center gap-4 text-gray-600">
        <span>{job.location.city}, {job.location.country}</span>
        <span>•</span>
        <span className="capitalize">{job.jobType.replace("_", " ")}</span>
        <span>•</span>
        <span className="capitalize">{job.jobSite}</span>
      </div>
    </div>
    {isAuthenticated && user?.role === "applicant" && (
      <button
        onClick={() => setShowApplyModal(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Apply Now
      </button>
    )}
  </div>
  
  {/* Job tags */}
  <div className="flex flex-wrap gap-2 mb-4">
    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
      {job.experienceLevel}
    </span>
    {job.sector && (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
        {job.sector}
      </span>
    )}
    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
      Deadline: {formatDate(job.deadline)}
    </span>
  </div>
</div>


        {/* Job details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Job Type:</span>
                  <span className="ml-2 font-medium capitalize">{job.jobType.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{job.location.city}, {job.location.country}</span>
                </div>
                <div>
                  <span className="text-gray-600">Work Site:</span>
                  <span className="ml-2 font-medium capitalize">{job.jobSite}</span>
                </div>
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <span className="ml-2 font-medium">{job.experienceLevel}</span>
                </div>
                <div>
                  <span className="text-gray-600">Posted:</span>
                  <span className="ml-2 font-medium">{formatDate(job.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Deadline:</span>
                  <span className="ml-2 font-medium">{formatDate(job.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons for employers/admins */}
            {(user?.role === "employer" || user?.role === "admin") && job.createdBy === user.id && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Manage Job</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => navigate(`/applications/job/${job._id}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Apply for {job.title}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume URL (Optional)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {applying ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 