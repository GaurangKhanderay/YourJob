"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MapPin,
  Clock,
  Users
} from "lucide-react";
import { Job } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const jobs = useQuery(api.jobs.getAllJobs, {
    search: searchTerm || undefined,
    type: filterType || undefined,
  });
  const deleteJob = useMutation(api.jobs.deleteJob);
  const updateJob = useMutation(api.jobs.updateJob);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      await deleteJob({ jobId });
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      await updateJob({
        jobId: job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        salary: job.salary,
        type: job.type,
        experience: job.experience,
        skills: job.skills,
        isActive: !job.isActive,
      });
      toast.success(`Job ${job.isActive ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

  const filteredJobs = jobs?.filter(job => {
    if (filterStatus === "active") return job.isActive;
    if (filterStatus === "inactive") return !job.isActive;
    return true;
  }) || [];

  const jobTypes = [
    { value: "", label: "All Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
  ];

  const statusFilters = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="mt-2 text-gray-600">
            Create, edit, and manage job listings.
          </p>
        </div>
        <a href="/admin/jobs/new" className="btn-primary px-6 py-3">
          <Plus className="h-5 w-5 mr-2" />
          Post New Job
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search jobs
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
                placeholder="Search by title, company..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              id="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-full"
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full"
            >
              {statusFilters.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Jobs ({filteredJobs.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button className="btn-outline text-sm px-4 py-2">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {job.type.replace("-", " ")}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatRelativeTime(job.postedAt)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applicationsCount} applications
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`p-2 rounded-lg transition-colors ${
                      job.isActive 
                        ? "text-orange-600 hover:bg-orange-100" 
                        : "text-green-600 hover:bg-green-100"
                    }`}
                    title={job.isActive ? "Deactivate" : "Activate"}
                  >
                    {job.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  
                  <a
                    href={`/admin/jobs/${job._id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </a>
                  
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType || filterStatus
                ? "Try adjusting your search criteria."
                : "Get started by posting your first job."}
            </p>
            <a href="/admin/jobs/new" className="btn-primary">
              Post New Job
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
