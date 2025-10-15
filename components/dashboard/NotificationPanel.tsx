"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { Notification } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

interface NotificationPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  notifications: Notification[];
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

export function NotificationPanel({ open, setOpen, notifications }: NotificationPanelProps) {
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllNotificationsAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
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

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification({ notificationId });
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Notifications
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 px-4 py-6 sm:px-6">
                  {unreadCount > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                  <div className="flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {notifications.length === 0 ? (
                        <li className="py-5">
                          <div className="text-center">
                            <div className="text-gray-500 text-sm">No notifications yet</div>
                          </div>
                        </li>
                      ) : (
                        notifications.map((notification) => {
                          const Icon = notificationIcons[notification.type];
                          const colorClass = notificationColors[notification.type];
                          
                          return (
                            <motion.li
                              key={notification._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                              className="py-5"
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium ${
                                      notification.isRead ? "text-gray-500" : "text-gray-900"
                                    }`}>
                                      {notification.title}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">
                                        {formatRelativeTime(notification.createdAt)}
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
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                  <p className={`text-sm ${
                                    notification.isRead ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                    {notification.message}
                                  </p>
                                  {notification.actionUrl && (
                                    <a
                                      href={notification.actionUrl}
                                      className="text-sm text-primary hover:text-primary/80 mt-1 block"
                                    >
                                      View details →
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
