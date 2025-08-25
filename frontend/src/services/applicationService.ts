import { api } from "./api";
import type { Application } from "../types/types";

export interface CreateApplicationData {
  jobId: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export async function applyForJob(applicationData: CreateApplicationData): Promise<Application> {
  const { data } = await api.post<Application>("/applications", applicationData);
  return data;
}

export async function getUserApplications(userId: string): Promise<Application[]> {
  const { data } = await api.get<Application[]>(`/applications/user/${userId}`);
  return data;
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
  const { data } = await api.get<Application[]>(`/applications/job/${jobId}`);
  return data;
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: string
): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${applicationId}`, { status });
  return data;
}
