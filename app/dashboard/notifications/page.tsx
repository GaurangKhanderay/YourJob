"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  XCircle,
  Trash2,
  Search
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
toast from "react-hot-toast";

interface Notification {
  _id: Id<"notifications">;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: number;
  actionUrl?: string;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const notificationColors = {
  info: "text-blue-600 bg-blue-100",
  success: "text-green-600 bg-green-100",
  warning: "text-yellow-600 bg-yellow-100",
  error: "text-red-600 bg-red-100",
};

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const notifications = useQuery(api.notifications.getUserNotifications, {});
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllNotificationsAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleMarkAsRead = async (notificationId: Id<"notifications">) => {
    try {
      await markAsRead({ notificationId });
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({});
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (notificationId: Id<"notifications">) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification({ notificationId });
        toast.success("Notification deleted");
      } catch (error) {
        toast.error("Failed to delete notification");
      }
    }
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  const totalCount = notifications?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount - unreadCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
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
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type];
            const colorClass = notificationColors[notification.type];
            
            return (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}> 
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-900'
                        }`}> 
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          notification.isRead ? 'text-gray-400' : 'text-gray-600'
                        }`}> 
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-2"
                          >
                            View details →
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "You're all caught up! New notifications will appear here."
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}