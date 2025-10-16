import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserNotifications = query({
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
      // Fallback to first user for demo
      const users = await ctx.db.query("users").collect();
      userId = (users[0]?._id as any) || ("" as any);
    }
    
    if (!userId) return [];
    
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadNotifications = query({
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
    
    return await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) => q.eq("userId", userId).eq("isRead", false))
      .order("desc")
      .collect();
  },
});

export const markNotificationAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or not authorized");
    }
    
    await ctx.db.patch(args.notificationId, { isRead: true });
    return { success: true };
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) => q.eq("userId", userId).eq("isRead", false))
      .collect();
    
    await Promise.all(
      unreadNotifications.map(notification =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );
    
    return { success: true };
  },
});

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      createdAt: Date.now(),
      actionUrl: args.actionUrl,
    });
    
    return notificationId;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userId = (users[0]?._id as any) || ("" as any);
    
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or not authorized");
    }
    
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});
