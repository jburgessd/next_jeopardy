import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createCategory = mutation({
  args: {
    categoryName: v.string(),
    clue1: v.id("clues"),
    clue2: v.id("clues"),
    clue3: v.id("clues"),
    clue4: v.id("clues"),
    clue5: v.id("clues"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("categories", {
      categoryName: args.categoryName,
      clue1: args.clue1,
      clue2: args.clue2,
      clue3: args.clue3,
      clue4: args.clue4,
      clue5: args.clue5,
    });
  },
});

export const getCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  },
});
