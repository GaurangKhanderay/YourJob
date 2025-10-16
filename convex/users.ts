import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProfile = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.email) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .first();
      return user;
    }
    // Fallback to first user for demo purposes
    const users = await ctx.db.query("users").collect();
    return users[0] || null;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").first();
    if (!user) return { success: false };
    await ctx.db.patch(user._id, { name: args.name });
    return { success: true };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const totalUsers = await ctx.db.query("users").collect();
    const totalJobs = await ctx.db.query("jobs").collect();
    const totalApplications = await ctx.db.query("applications").collect();
    const totalResumes = await ctx.db.query("resumes").collect();
    
    return {
      totalUsers: totalUsers.length || 2,
      totalJobs: totalJobs.length || 0,
      totalApplications: totalApplications.length || 0,
      totalResumes: totalResumes.length || 0,
    };
  },
});

export const upsertUserFromSession = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        lastLoginAt: Date.now(),
      });
      return existing._id;
    }
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "user",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
    return userId;
  },
});
