import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    location: v.string(),
    salary: v.optional(v.string()),
    type: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("internship")),
    experience: v.string(),
    skills: v.array(v.string()),
    postedBy: v.id("users"),
    postedAt: v.number(),
    isActive: v.boolean(),
    applicationsCount: v.number(),
  }).index("by_posted_by", ["postedBy"])
    .index("by_active", ["isActive"])
    .index("by_type", ["type"]),

  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("applied"),
      v.literal("under-review"),
      v.literal("interview-scheduled"),
      v.literal("interviewed"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    appliedAt: v.number(),
    updatedAt: v.number(),
    notes: v.optional(v.string()),
    resumeId: v.optional(v.id("resumes")),
  }).index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_status", ["status"]),

  resumes: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    fileUrl: v.string(),
    uploadedAt: v.number(),
    analysis: v.optional(v.object({
      score: v.number(),
      clarity: v.number(),
      keywords: v.number(),
      atsCompatibility: v.number(),
      feedback: v.array(v.string()),
      suggestions: v.array(v.string()),
      analyzedAt: v.number(),
    })),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    isRead: v.boolean(),
    createdAt: v.number(),
    actionUrl: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_unread", ["userId", "isRead"]),

  analytics: defineTable({
    totalUsers: v.number(),
    totalJobs: v.number(),
    totalApplications: v.number(),
    totalResumes: v.number(),
    date: v.string(),
    createdAt: v.number(),
  }).index("by_date", ["date"]),
});
