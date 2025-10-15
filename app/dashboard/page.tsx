"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  FileText, 
  BarChart3, 
  Bell, 
  TrendingUp,
  Users,
  Calendar,
  Star,
  Eye,
  Plus,
  ArrowRight
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const jobs = useQuery(api.jobs.getAllJobs, { limit: 10 });
  const applications = useQuery(api.jobs.getUserApplications, {});
  const resumes = useQuery(api.resumes.getUserResumes, {});
  const notifications = useQuery(api.notifications.getUserNotifications, {});

  const recentApplications = applications?.slice(0, 5) || [];
  const recentJobs = jobs?.slice(0, 6) || [];
  const analyzedResumes = resumes?.filter(r => r.analysis) || [];

  const stats = {
    totalApplications: applications?.length || 0,
    activeApplications: applications?.filter(app => 
      ["applied", "under-review", "interview-scheduled", "interviewed"].includes(app.status)
    ).length || 0,
    totalResumes: resumes?.length || 0,
    analyzedResumes: analyzedResumes.length,
    averageScore: analyzedResumes.length > 0 
      ? Math.round(analyzedResumes.reduce((sum, r) => sum + (r.analysis?.score || 0), 0) / analyzedResumes.length)
      : 0,
    unreadNotifications: notifications?.filter(n => !n.isRead).length || 0,
  };

  const quickActions = [
    {
      title: "Browse Jobs",
      description: "Find new opportunities",
      icon: Briefcase,
      href: "/dashboard/jobs",
      color: "bg-blue-500",
    },
    {
      title: "Upload Resume",
      description: "Get AI analysis",
      icon: FileText,
      href: "/dashboard/resumes",
      color: "bg-green-500",
    },
    {
      title: "View Applications",
      description: "Track your progress",
      icon: BarChart3,
      href: "/dashboard/applications",
      color: "bg-purple-500",
    },
    {
      title: "Notifications",
      description: `${stats.unreadNotifications} unread`,
      icon: Bell,
      href: "/dashboard/notifications",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your job search.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resumes Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.analyzedResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Resume Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <Link href="/dashboard/applications" className="text-primary hover:text-primary/80 text-sm">
                View all
              </Link>
            </div>
            
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application, index) => (
                  <div key={application._id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {application.job?.title || "Job Title"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.job?.company || "Company"} • {application.status}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No applications yet</p>
                <Link href="/dashboard/jobs" className="text-primary hover:text-primary/80 text-sm">
                  Start applying
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured Jobs</h2>
              <Link href="/dashboard/jobs" className="text-primary hover:text-primary/80 text-sm">
                View all
              </Link>
            </div>
            
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <div key={job._id} className="flex items-start justify-between py-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        {job.salary && <span>{job.salary}</span>}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No jobs available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Resume Analysis Summary */}
        {analyzedResumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Analysis Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                  <span className="text-2xl font-bold text-green-600">{stats.averageScore}</span>
                </div>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
                  <span className="text-2xl font-bold text-blue-600">{stats.analyzedResumes}</span>
                </div>
                <p className="text-sm text-gray-600">Resumes Analyzed</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-2">
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.max(...analyzedResumes.map(r => r.analysis?.score || 0))}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Best Score</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}