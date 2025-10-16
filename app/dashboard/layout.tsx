"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();
  
  const notifications = useQuery(api.notifications.getUserNotifications, { 
    email: session?.user?.email || undefined 
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <Navbar 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsClick={() => setNotificationsOpen(true)}
          notificationCount={notifications?.filter(n => !n.isRead).length || 0}
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <NotificationPanel 
        open={notificationsOpen} 
        setOpen={setNotificationsOpen}
        notifications={notifications || []}
      />
    </div>
  );
}
