"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign,
  FileText,
  Filter,
  Search
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Application {
  _id: Id<"applications">;
  jobId: Id<"jobs">;
  status: string;
  appliedAt: number;
  updatedAt: number;
  notes?: string;
  resumeId?: Id<"resumes">;
  job?: {
    _id: Id<"jobs">;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
  };
}

const statusConfig = {
  applied: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Applied" },
  "under-review": { color: "bg-yellow-100 text-yellow-800", icon: Eye, label: "Under Review" },
  "interview-scheduled": { color: "bg-purple-100 text-purple-800", icon: Calendar, label: "Interview Scheduled" },
  "interviewed": { color: "bg-indigo-100 text-indigo-800", icon: CheckCircle, label: "Interviewed" },
  "offer": { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Offer Received" },
  "rejected": { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" },
  "withdrawn": { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Withdrawn" },
};

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { data: session } = useSession();

  const applications = useQuery(api.jobs.getUserApplications, { 
    email: session?.user?.email || undefined 
  });
  const updateApplicationStatus = useMutation(api.jobs.updateApplicationStatus);

  const handleStatusUpdate = async (applicationId: Id<"applications">, newStatus: "applied" | "under-review" | "interview-scheduled" | "interviewed" | "offer" | "rejected" | "withdrawn") => {
    try {
      await updateApplicationStatus({ applicationId, status: newStatus });
      toast.success("Application status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredApplications = applications?.filter(app => {
    const matchesSearch = !searchTerm || 
      app.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.appliedAt - a.appliedAt;
      case "oldest":
        return a.appliedAt - b.appliedAt;
      case "company":
        return (a.job?.company || "").localeCompare(b.job?.company || "");
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const statusCounts = applications?.reduce((counts, app) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <config.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{config.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts[status] || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>
        </motion.div>

        {/* Applications List */}
        <div className="space-y-4">
          {sortedApplications.map((application, index) => {
            const statusInfo = statusConfig[application.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo?.icon || Clock;
            
            return (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.job?.title || "Job Title"}
                        </h3>
                        <p className="text-gray-600">{application.job?.company || "Company"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.color || "bg-gray-100 text-gray-800"}`}>
                          <StatusIcon className="h-4 w-4 inline mr-1" />
                          {statusInfo?.label || application.status}
                        </span>
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusUpdate(application._id, e.target.value as "applied" | "under-review" | "interview-scheduled" | "interviewed" | "offer" | "rejected" | "withdrawn")}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {Object.entries(statusConfig).map(([status, config]) => (
                            <option key={status} value={status}>{config.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.job?.location || "Location"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {application.job?.type || "Type"}
                      </div>
                      {application.job?.salary && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {application.job.salary}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {application.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {application.resumeId && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-1" />
                            Resume attached
                          </div>
                        )}
                        <span className="text-xs text-gray-500">
                          Last updated: {new Date(application.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          View Job
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sortedApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search criteria or filters"
                : "Start applying to jobs to see them here"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Browse Jobs
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}