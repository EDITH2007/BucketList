import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getItems = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bucketItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getItemsByStatus = query({
  args: { userId: v.string(), completed: v.boolean() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bucketItems")
      .withIndex("by_completed", (q) => 
        q.eq("userId", args.userId).eq("completed", args.completed)
      )
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("bucketItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const byCategory = items.reduce((acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const countries = [...new Set(items.map((i) => i.country))];
    const totalBudget = items.reduce((sum, item) => sum + (item.budget || 0), 0);

    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
      countriesVisited: completed > 0 
        ? [...new Set(items.filter((i: any) => i.completed).map((i: any) => i.country))].length 
        : 0,
      totalCountries: countries.length,
      totalBudget,
    };
  },
});

export const addItem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    country: v.string(),
    coordinates: v.object({ lat: v.number(), lng: v.number() }),
    category: v.union(
      v.literal("adventure"),
      v.literal("culture"),
      v.literal("food"),
      v.literal("nature"),
      v.literal("relaxation"),
      v.literal("photography")
    ),
    priority: v.union(v.literal("must"), v.literal("should"), v.literal("nice")),
    targetDate: v.optional(v.number()),
    budget: v.optional(v.number()),
    currency: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bucketItems", {
      ...args,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("bucketItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    
    return await ctx.db.patch(args.id, {
      completed: !item.completed,
      completedAt: !item.completed ? Date.now() : undefined,
    });
  },
});

export const deleteItem = mutation({
  args: { id: v.id("bucketItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("bucketItems"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      priority: v.optional(v.union(v.literal("must"), v.literal("should"), v.literal("nice"))),
      targetDate: v.optional(v.number()),
      budget: v.optional(v.number()),
      notes: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, args.updates);
  },
});