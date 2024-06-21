import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createBoard = mutation({
  args: {
    category1: v.id("categories"),
    category2: v.id("categories"),
    category3: v.id("categories"),
    category4: v.id("categories"),
    category5: v.id("categories"),
    category6: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("boards", {
      category1: args.category1,
      category2: args.category2,
      category3: args.category3,
      category4: args.category4,
      category5: args.category5,
      category6: args.category6,
    });
  },
});

export const getBoardById = query({
  args: { gameId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
