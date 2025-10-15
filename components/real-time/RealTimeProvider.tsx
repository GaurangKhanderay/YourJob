"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

export function RealTimeProvider() {
  const unreadNotifications = useQuery(api.notifications.getUnreadNotifications);
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);

  useEffect(() => {
    // This effect runs when unread notifications change
    // In a real app, you might want to show a toast for new notifications
    if (unreadNotifications && unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[0];
      
      // Only show toast if the notification is very recent (within last 5 seconds)
      const isRecent = Date.now() - latestNotification.createdAt < 5000;
      
      if (isRecent) {
        toast.success(latestNotification.message, {
          duration: 5000,
        });
      }
    }
  }, [unreadNotifications, markAsRead]);

  // This component doesn't render anything, it just handles real-time updates
  return null;
}
