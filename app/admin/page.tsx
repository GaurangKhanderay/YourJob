"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  TrendingUp,
  UserCheck,
  Calendar,
  DollarSign,
  Database
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const userStats = useQuery(api.users.getUserStats);
  const allUsers = useQuery(api.users.getAllUsers);
  const allJobs = useQuery(api.jobs.getAllJobs, {});
  const allResumes = useQuery(api.resumes.getAllResumes);
  const seedAll = useMutation(api.seed.seedAll);

  const recentUsers = allUsers?.slice(0, 5) || [];
  const recentJobs = allJobs?.slice(0, 5) || [];

  const handleSeedData = async () => {
    try {
      const result = await seedAll({});
      toast.success("Sample data seeded successfully!");
      console.log(result);
    } catch (error) {
      toast.error("Failed to seed data");
      console.error(error);
    }
  };

  const stats = [
    {
      name: "Total Users",
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Active Jobs",
      value: userStats?.totalJobs || 0,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Resumes Uploaded",
      value: userStats?.totalResumes || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+15%",
      changeType: "positive",
    },
    {
      name: "Total Applications",
      value: userStats?.totalApplications || 0,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+22%",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of platform activity and user engagement.
          </p>
        </div>
        <button
          onClick={handleSeedData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Database className="h-4 w-4" />
          Seed Sample Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <a href="/admin/users" className="text-sm text-primary hover:text-primary/80">
                View all
              </a>
            </div>
          </div>
          <div className="p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
              <a href="/admin/jobs" className="text-sm text-primary hover:text-primary/80">
                View all
              </a>
            </div>
          </div>
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {job.location} • {formatDate(job.postedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {job.applicationsCount} applications
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No jobs posted yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/jobs/new"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Post New Job</p>
                <p className="text-sm text-blue-700">Create a job listing</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-900">Manage Users</p>
                <p className="text-sm text-green-700">View and edit users</p>
              </div>
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-purple-900">View Analytics</p>
                <p className="text-sm text-purple-700">Detailed insights</p>
              </div>
            </a>
            <a
              href="/admin/notifications"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-orange-900">Send Notification</p>
                <p className="text-sm text-orange-700">Notify users</p>
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
