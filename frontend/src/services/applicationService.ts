import { api } from "./api";
import type { Application } from "../types/types";

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
  resumeFile?: File;
  resumeUrl?: string;
}

export async function applyForJob(applicationData: CreateApplicationData): Promise<Application> {
  // If a file was provided, send multipart/form-data; otherwise JSON
  if (applicationData.resumeFile) {
    const form = new FormData();
    form.append("jobId", applicationData.jobId);
    if (applicationData.coverLetter) form.append("coverLetter", applicationData.coverLetter);
    form.append("resume", applicationData.resumeFile);
    if (applicationData.resumeUrl) form.append("resumeUrl", applicationData.resumeUrl);

    const { data } = await api.post<Application>("/applications", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  const { data } = await api.post<Application>("/applications", applicationData);
  return data;
}

export async function getUserApplications(): Promise<Application[]> {
  const { data } = await api.get<Application[]>(`/applications/user/`);
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
