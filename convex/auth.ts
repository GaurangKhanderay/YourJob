import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Deprecated in favor of NextAuth on client
    try {
      const users = await ctx.db.query("users").collect();
      return users[0] || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
});

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Not used with NextAuth
    return { userId: null, message: "Use Google Sign-In" };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Not used with NextAuth
    return { userId: null, user: null };
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const { userId, role } = args;
    
    await ctx.db.patch(userId, { role });
    return { success: true };
  },
});
