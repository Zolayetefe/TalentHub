import React from "react";
import type { Job } from "../types/types";

interface JobCardProps {
  job: Job;
  onViewDetails: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">
        {job.location.city}, {job.location.country}
      </p>
      <p className="text-gray-500 text-sm mb-4">
        {job.jobType} · {job.jobSite}
      </p>
      <button
        onClick={onViewDetails}
        className="text-blue-600 font-medium hover:underline"
      >
        View Details
      </button>
    </div>
  );
};

export default JobCard;
