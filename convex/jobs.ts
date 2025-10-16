import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllJobs = query({
  args: {
    type: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      let jobs = await ctx.db
        .query("jobs")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
      
      // Filter by type
      if (args.type && args.type !== "all") {
        jobs = jobs.filter(job => job.type === args.type);
      }
      
      // Filter by search term
      if (args.search && args.search.trim()) {
        const searchTerm = args.search.toLowerCase().trim();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }
      
      // Sort by posted date (newest first)
      jobs = jobs.sort((a, b) => b.postedAt - a.postedAt);
      
      // Apply limit if specified
      if (args.limit && args.limit > 0) {
        jobs = jobs.slice(0, args.limit);
      }
      
      return jobs;
    } catch (error) {
      console.error("Error getting jobs:", error);
      return [];
    }
  },
});

export const getJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    try {
      const job = await ctx.db.get(args.jobId);
      if (!job) {
        throw new Error("Job not found");
      }
      return job;
    } catch (error) {
      console.error("Error getting job:", error);
      return null;
    }
  },
});

export const createJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    location: v.string(),
    salary: v.optional(v.string()),
    type: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("internship")),
    experience: v.string(),
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // In production, ensure only admins can create
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "admin@yourjob.com"))
      .first();
    const adminUserId = admin?._id as any;
    
    const jobId = await ctx.db.insert("jobs", {
      ...args,
      postedBy: adminUserId,
      postedAt: Date.now(),
      isActive: true,
      applicationsCount: 0,
    });
    
    return jobId;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.string(),
    company: v.string(),
    description: v.string(),
    location: v.string(),
    salary: v.optional(v.string()),
    type: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("internship")),
    experience: v.string(),
    skills: v.array(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updateData } = args;
    await ctx.db.patch(jobId, updateData);
    
    return { success: true };
  },
});

export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);
    return { success: true };
  },
});

export const applyToJob = mutation({
  args: {
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("resumes")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    // Check if already applied
    const existingApplication = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();
    
    if (existingApplication) {
      throw new Error("Already applied to this job");
    }
    
    const applicationId = await ctx.db.insert("applications", {
      userId,
      jobId: args.jobId,
      status: "applied",
      appliedAt: Date.now(),
      updatedAt: Date.now(),
      notes: args.notes,
      resumeId: args.resumeId,
    });
    
    // Update job applications count
    const job = await ctx.db.get(args.jobId);
    if (job) {
      await ctx.db.patch(args.jobId, {
        applicationsCount: job.applicationsCount + 1,
      });
    }
    
    return applicationId;
  },
});

export const getUserApplications = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = "" as any;
    
    if (args.email) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .first();
      userId = user?._id || "";
    } else {
      const users = await ctx.db.query("users").collect();
      userId = (users[0]?._id as any) || ("" as any);
    }
    
    if (!userId) return [];
    
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );
    
    return applicationsWithJobs.sort((a, b) => b.appliedAt - a.appliedAt);
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("applied"),
      v.literal("under-review"),
      v.literal("interview-scheduled"),
      v.literal("interviewed"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});
