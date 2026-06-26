import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bucketItems: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    country: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    category: v.union(
      v.literal("adventure"),
      v.literal("culture"),
      v.literal("food"),
      v.literal("nature"),
      v.literal("relaxation"),
      v.literal("photography")
    ),
    priority: v.union(v.literal("must"), v.literal("should"), v.literal("nice")),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    targetDate: v.optional(v.number()),
    budget: v.optional(v.number()),
    currency: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_completed", ["userId", "completed"])
    .index("by_category", ["userId", "category"]),
});