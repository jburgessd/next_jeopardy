import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createGame = mutation({
  args: {
    title: v.string(),
    jeopardy: v.id("boards"),
    doubleJeopardy: v.id("boards"),
    finalJeopardy: v.object({
      category: v.string(),
      clue: v.string(),
      media: v.optional(v.string()),
      response: v.string(),
    }),
    plays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const gameExists = await ctx.db
      .query("createdGames")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();
    if (gameExists || gameExists === args) {
      return gameExists;
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be signed in to create a clue."
      );
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity?.email))
      .first();

    const gameId: Id<"createdGames"> = await ctx.db.insert("createdGames", {
      title: args.title,
      creator: user!._id,
      jeopardy: args.jeopardy,
      doubleJeopardy: args.doubleJeopardy,
      finalJeopardy: args.finalJeopardy,
      plays: args.plays!,
    });
    const ret = await ctx.db.get(gameId);
    return ret;
  },
});

export const archiveGame = mutation({
  args: {
    title: v.string(),
    airDate: v.string(),
    jeopardy: v.id("boards"),
    doubleJeopardy: v.id("boards"),
    finalJeopardy: v.object({
      category: v.string(),
      clue: v.string(),
      media: v.optional(v.string()),
      response: v.string(),
    }),
    plays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const gameExists = await ctx.db
      .query("archiveGames")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();
    if (gameExists || gameExists === args) {
      return gameExists;
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be signed in to create a clue."
      );
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity?.email))
      .first();

    const gameId: Id<"archiveGames"> = await ctx.db.insert("archiveGames", {
      title: args.title,
      airDate: args.airDate,
      jeopardy: args.jeopardy,
      doubleJeopardy: args.doubleJeopardy,
      finalJeopardy: args.finalJeopardy,
      plays: args.plays!,
    });
    const ret = await ctx.db.get(gameId);
    return ret;
  },
});

export const getCreatedGames = query({
  handler: async (ctx) => {
    const games = await ctx.db.query("createdGames").collect();
    if (games.length === 0) {
      throw new ConvexError(
        "No games found" + 404 + "No games found in the database."
      );
    }
    return games;
  },
});

export const getCreatedGameById = query({
  args: { gameId: v.id("createdGames") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
