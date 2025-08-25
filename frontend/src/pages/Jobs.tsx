import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import type { Job } from "../types/types";
import { useAuth } from "../contexts/AuthContext";

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("");
  const [jobSiteFilter, setJobSiteFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobsData = await getAllJobs();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesJobType = jobTypeFilter ? job.jobType === jobTypeFilter : true;
      const matchesJobSite = jobSiteFilter ? job.jobSite === jobSiteFilter : true;
      const matchesExperience = experienceFilter ? job.experienceLevel === experienceFilter : true;

      return matchesSearch && matchesJobType && matchesJobSite && matchesExperience;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, jobTypeFilter, jobSiteFilter, experienceFilter, jobs]);

  const handleViewDetails = (jobId: string) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/job/${jobId}` } });
    } else {
      navigate(`/job/${jobId}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setJobTypeFilter("");
    setJobSiteFilter("");
    setExperienceFilter("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-100 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Find Your Dream Job</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search jobs by title, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="transform transition-transform hover:scale-105 duration-200"
              >
                <JobCard
                  job={job}
                  onViewDetails={() => handleViewDetails(job._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">No jobs match your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;