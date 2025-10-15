"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase, ExternalLink } from "lucide-react";
import { Job } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
}

export function JobCard({ job, showApplyButton = true }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const applyToJob = useMutation(api.jobs.applyToJob);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyToJob({
        jobId: job._id,
      });
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to apply to job");
    } finally {
      setIsApplying(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(job.type)}`}>
          {job.type.replace("-", " ")}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          Posted {formatRelativeTime(job.postedAt)}
        </div>
        {job.salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            {job.salary}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="h-4 w-4 mr-2" />
          {job.experience}
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {job.applicationsCount} application{job.applicationsCount !== 1 ? "s" : ""}
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline text-sm px-4 py-2">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Details
          </button>
          {showApplyButton && (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="btn-primary text-sm px-4 py-2"
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
