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

  useEffect(() => {
    const sync = async () => {
      if (status === "loading") return;
      if (session?.user?.email && session.user.name) {
        try {
          await upsertUser({ email: session.user.email, name: session.user.name });
          setUser({
            _id: "" as Id<"users">, // placeholder ID for client-side use
            email: session.user.email,
            name: session.user.name,
            role: "user",
            createdAt: Date.now(),
          });
        } catch (e) {
          // ignore
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    sync();
  }, [session, status, upsertUser]);

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
