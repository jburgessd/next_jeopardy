import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createClue = mutation({
  args: {
    clue: v.string(),
    media: v.optional(v.string()),
    response: v.string(),
    value: v.number(),
    creator: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("clues", {
      clue: args.clue,
      media: args.media,
      response: args.response,
      value: args.value,
      creator: args.creator,
    });
  },
});

export const getClueById = query({
  args: { clueId: v.id("clues") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clueId);
  },
});
