// jobService.ts
import { api } from "./api";
import type { Job } from "../types/types";

export interface CreateJobData {
  title: string;
  description: string;
  jobType: Job["jobType"];
  jobSite: Job["jobSite"];
  location: {
    city: string;
    country: string;
  };
  skills?: string[];
  sector?: string;
  experienceLevel: Job["experienceLevel"];
  deadline: string;
  status?: "OPEN" | "CLOSED"; 
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export async function getAllJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>("/jobs");
  return data;
}

export async function getJobById(jobId: string): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${jobId}`);
  return data;
}
export async function getEmployerJobs(employerId: string): Promise<Job[]> {
  const { data } = await api.get<Job[]>(`/jobs/employer/${employerId}`);
  return data;
}

export async function createJob(jobData: CreateJobData): Promise<Job> {
  const { data } = await api.post<Job>("/jobs", jobData);
  return data;
}

export async function deleteJob(jobId: string): Promise<void> {
  await api.delete(`/jobs/${jobId}`);
}

export async function updateJob(jobId: string, jobData: Partial<CreateJobData>): Promise<Job> {
  const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${jobId}`, jobData);
  return data.data;
}

export async function closeJob(jobId: string): Promise<Job> {
  const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${jobId}`, { status: "CLOSED" });
  return data.data;
}
