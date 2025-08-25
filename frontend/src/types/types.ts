export type Role = "applicant" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}


export interface Job {
  _id: string;
  title: string;
  description: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  jobSite: "ONSITE" | "REMOTE" | "HYBRID";
  location: {
    city: string;
    country: string;
  };
  skills?: string[];
  sector?: string;
  experienceLevel: "JUNIOR" | "MID" | "SENIOR";
  deadline: string; // ISO date string
  createdBy: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: string | {
    _id: string;
    title: string;
    location:{
      city:string;
      country:string;
    }
    jobType:string;
    jobSite:string;

  };
  userId: string | {
    _id: string;
    name: string;
    email: string;
  };
  resumeUrl?: string; 
  coverLetter?: string; 
  status: "applied" | "shortlisted" | "rejected"; 
  createdAt: string; 
  updatedAt: string; 
  // Populated fields when fetching with job details
  job?: Job;
  user?: User;
}
