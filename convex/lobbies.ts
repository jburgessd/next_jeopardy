import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { create } from "domain";

export const createLobby = mutation({
  args: {
    host: v.id("users"),
    players: v.array(
      v.object({
        _id: v.id("users"),
        name: v.string(),
        score: v.number(),
      })
    ),
    game: v.string() || v.id("createdGames"),
    timer: v.number(),
    finalTimer: v.number(),
    update: v.object({
      clue: v.string(), // 'J,2,4' means Single Jeopardy, Category 2 out of 6, Clue 4 out of 5
      timerStart: v.boolean(),
      activeBuzz: v.boolean(),
      buzzIn: v.array(v.id("users")),
      prevBuzz: v.array(v.id("users")),
    }),
    boardState: v.object({
      jeopardy: v.string(),
      doubleJeopardy: v.string(),
      finalJeopardy: v.string(),
    }),
    status: v.string(),
    gameId: v.string(),
    hostGameName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be signed in to create a lobby."
      );
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity?.email))
      .first();

    const lobbyExists = await ctx.db
      .query("lobbies")
      .filter((q) => q.eq(q.field("host"), user!._id))
      .first();

    if (lobbyExists || lobbyExists === args) {
      removeLobby(ctx, { lobbyId: lobbyExists._id });
    }

    const lobbyId: Id<"lobbies"> = await ctx.db.insert("lobbies", {
      host: args.host,
      players: args.players,
      game: args.game,
      status: args.status,
      gameId: args.gameId,
      timer: 6,
      finalTimer: 30,
      hostGameName: args.hostGameName,
      update: {
        clue: "",
        timerStart: false,
        activeBuzz: false,
        buzzIn: [],
        prevBuzz: [],
      },
      boardState: {
        jeopardy: "000000",
        doubleJeopardy: "000000",
        finalJeopardy: "00",
      },
    });

    const ret = await ctx.db.get(lobbyId);
    return ret;
  },
});

export const updateLobby = mutation({
  args: {
    lobbyId: v.id("lobbies"),
    host: v.id("users"),
    players: v.array(
      v.object({
        _id: v.id("users"),
        name: v.string(),
        score: v.number(),
      })
    ),
    game: v.id("createdGames") || v.string(),
    status: v.string(),
    gameId: v.string(),
    hostGameName: v.string(),
    board: v.object({
      jeopardy: v.string(),
      doubleJeopardy: v.string(),
      finalJeopardy: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const lobby = await ctx.db.get(args.lobbyId);
    if (!lobby) {
      throw new ConvexError(
        "Lobby not found" +
          404 +
          "The lobby you are trying to update does not exist."
      );
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be signed in to update a lobby."
      );
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity?.email))
      .first();

    if (lobby.host !== user!._id) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be the host to update a lobby."
      );
    }

    await ctx.db.patch(lobby._id, {
      host: args.host,
      players: args.players,
      game: args.game,
      status: args.status,
      gameId: args.gameId,
      hostGameName: args.hostGameName,
      boardState: args.board,
    });
  },
});

export const checkForExistingLobby = mutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const lobby = await ctx.db
      .query("lobbies")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .first();
    if (lobby) {
      return true;
    }
    return false;
  },
});

export const getLobbiesByHost = query({
  args: { host: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lobbies")
      .filter((q) => q.eq(q.field("host"), args.host));
  },
});

export const getLobbyById = query({
  args: { lobbyId: v.id("lobbies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lobbyId);
  },
});

export const getIdleLobbies = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("lobbies")
      .filter((q) => q.eq(q.field("status"), "setup"));
  },
});

export const removeLobby = mutation({
  args: { lobbyId: v.id("lobbies") },
  handler: async (ctx, args) => {
    const lobby = await ctx.db.get(args.lobbyId);
    if (!lobby) {
      throw new ConvexError(
        "Lobby not found" +
          404 +
          "The lobby you are trying to remove does not exist."
      );
    }
    await ctx.db.delete(args.lobbyId);
  },
});
