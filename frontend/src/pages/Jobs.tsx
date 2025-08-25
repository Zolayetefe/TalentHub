import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import type { Job } from "../types/types";
import { useAuth } from "../contexts/AuthContext";

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobsData = await getAllJobs();
        setJobs(jobsData);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewDetails = (jobId: string) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/job/${jobId}` } });
    } else {
      navigate(`/job/${jobId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewDetails={() => handleViewDetails(job._id)}
            />
          ))}
        </div>
      ) : (
        <p>No jobs available at the moment.</p>
      )}
    </div>
  );
};

export default Jobs;
