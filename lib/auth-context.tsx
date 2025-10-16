"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: number;
  lastLoginAt?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<boolean>;
  signUp: () => Promise<boolean>;
  signOut: () => void;
  updateProfile: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const upsertUser = useMutation(api.users.upsertUserFromSession);
  const updateProfileMutation = useMutation(api.users.updateProfile);

  const userProfile = useQuery(api.users.getProfile, { 
    email: session?.user?.email || undefined 
  });

  useEffect(() => {
    const sync = async () => {
      if (status === "loading") return;
      if (session?.user?.email && session.user.name) {
        try {
          const userId = await upsertUser({ email: session.user.email, name: session.user.name });
          // User will be set when userProfile query resolves
        } catch (e) {
          console.error("Error syncing user:", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    sync();
  }, [session, status, upsertUser]);

  // Set user when profile is loaded
  useEffect(() => {
    if (userProfile && session?.user?.email) {
      setUser({
        _id: userProfile._id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        createdAt: userProfile.createdAt,
        lastLoginAt: userProfile.lastLoginAt,
      });
    }
  }, [userProfile, session]);

  const signIn = async (): Promise<boolean> => {
    try {
      await nextAuthSignIn("google");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      return false;
    }
  };

  const signUp = async (): Promise<boolean> => {
    await nextAuthSignIn("google");
    return true;
  };

  const signOut = () => {
    setUser(null);
    nextAuthSignOut();
    toast.success("Signed out successfully");
  };

  const updateProfile = async (name: string): Promise<boolean> => {
    try {
      await updateProfileMutation({ name });
      if (user) {
        setUser({ ...user, name });
      }
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
