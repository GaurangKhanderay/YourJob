export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: number;
  lastLoginAt?: number;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  skills: string[];
  postedBy: string;
  postedAt: number;
  isActive: boolean;
  applicationsCount: number;
}

export interface Application {
  _id: string;
  userId: string;
  jobId: string;
  status: "applied" | "under-review" | "interview-scheduled" | "interviewed" | "offer" | "rejected" | "withdrawn";
  appliedAt: number;
  updatedAt: number;
  notes?: string;
  resumeId?: string;
  job?: Job;
}

export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: number;
  analysis?: ResumeAnalysis;
}

export interface ResumeAnalysis {
  score: number;
  clarity: number;
  keywords: number;
  atsCompatibility: number;
  feedback: string[];
  suggestions: string[];
  analyzedAt: number;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: number;
  actionUrl?: string;
}

export interface Analytics {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalResumes: number;
}

export interface JobFilters {
  type?: string;
  search?: string;
  location?: string;
  experience?: string;
}

export interface ApplicationStatus {
  label: string;
  color: string;
  bgColor: string;
}

export const APPLICATION_STATUSES: Record<string, ApplicationStatus> = {
  applied: {
    label: "Applied",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  "under-review": {
    label: "Under Review",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  "interview-scheduled": {
    label: "Interview Scheduled",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  interviewed: {
    label: "Interviewed",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  offer: {
    label: "Offer",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export const JOB_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;
