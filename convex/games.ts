import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createGame = mutation({
  args: {
    title: v.string(),
    airDate: v.string(),
    creator: v.string(),
    jeopardy: v.id("boards"),
    doubleJeopardy: v.id("boards"),
    finalJeopardy: v.id("clues"),
    plays: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("games", {
      title: args.title,
      airDate: args.airDate,
      creator: args.creator,
      jeopardy: args.jeopardy,
      doubleJeopardy: args.doubleJeopardy,
      finalJeopardy: args.finalJeopardy,
      plays: args.plays,
    });
  },
});

export const getGameById = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
