import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getUserResumes = query({
  args: {},
  handler: async (ctx) => {
    try {
      const users = await ctx.db.query("users").collect();
      const userId = (users[0]?._id as any) || ("" as any);
      
      const resumes = await ctx.db
        .query("resumes")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      
      return resumes.sort((a, b) => b.uploadedAt - a.uploadedAt);
    } catch (error) {
      console.error("Error getting user resumes:", error);
      return [];
    }
  },
});

export const uploadResume = mutation({
  args: {
    fileName: v.string(),
    fileUrl: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const users = await ctx.db.query("users").collect();
      const userId = (users[0]?._id as any) || ("" as any);
      
      if (!args.fileName || !args.fileUrl) {
        throw new ConvexError("File name and URL are required");
      }
      
      const resumeId = await ctx.db.insert("resumes", {
        userId,
        fileName: args.fileName,
        fileUrl: args.fileUrl,
        uploadedAt: Date.now(),
      });
      
      // If content is provided, analyze the resume
      if (args.content) {
        // For now, we'll skip the analysis to avoid the import issue
        // In a real app, you'd call the analysis function here
        console.log("Resume content provided for analysis:", args.content.length, "characters");
      }
      
      return resumeId;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  },
});

export const updateResumeAnalysis = mutation({
  args: {
    resumeId: v.id("resumes"),
    analysis: v.object({
      score: v.number(),
      clarity: v.number(),
      keywords: v.number(),
      atsCompatibility: v.number(),
      feedback: v.array(v.string()),
      suggestions: v.array(v.string()),
      analyzedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error("Resume not found or not authorized");
    }
    
    await ctx.db.patch(args.resumeId, {
      analysis: args.analysis,
    });
    
    return { success: true };
  },
});

export const deleteResume = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error("Resume not found or not authorized");
    }
    
    await ctx.db.delete(args.resumeId);
    return { success: true };
  },
});

export const getAllResumes = query({
  args: {},
  handler: async (ctx) => {
    const resumes = await ctx.db.query("resumes").collect();
    
    const resumesWithUsers = await Promise.all(
      resumes.map(async (resume) => {
        const user = await ctx.db.get(resume.userId);
        return { ...resume, user };
      })
    );
    
    return resumesWithUsers;
  },
});
