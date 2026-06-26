import { Doc } from "../../convex/_generated/dataModel";

export type Category = "adventure" | "culture" | "food" | "nature" | "relaxation" | "photography";
export type Priority = "must" | "should" | "nice";

export type BucketItem = Doc<"bucketItems">;

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byCategory: Record<string, number>;
  countriesVisited: number;
  totalCountries: number;
  totalBudget: number;
}