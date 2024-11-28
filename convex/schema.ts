import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  archiveGames: defineTable({
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
    plays: v.number(),
  })
    .index("by_date", ["airDate"])
    .index("by_title", ["title"])
    .index("by_plays", ["plays"]),

  lobbies: defineTable({
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
    status: v.string(),
    gameId: v.string(),
    hostGameName: v.string(),
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
  })
    .index("by_host", ["host"])
    .index("by_game", ["game"]),

  createdGames: defineTable({
    title: v.string(),
    creator: v.id("users"),
    jeopardy: v.id("boards"),
    doubleJeopardy: v.id("boards"),
    finalJeopardy: v.object({
      category: v.string(),
      clue: v.string(),
      media: v.optional(v.string()),
      response: v.string(),
    }),
    plays: v.number(),
  })
    .index("by_plays", ["plays"])
    .index("by_creator", ["creator"])
    .index("by_title", ["title"]),

  boards: defineTable({
    categories: v.array(v.id("categories")),
  }),

  categories: defineTable({
    categoryName: v.string(),
    clues: v.array(v.id("clues")),
  }).index("by_category", ["categoryName"]),

  clues: defineTable({
    clue: v.string(),
    media: v.optional(v.string()),
    double: v.optional(v.boolean()),
    response: v.string(),
    value: v.number(),
    creator: v.id("users"),
  })
    .index("by_clue", ["clue"])
    .index("by_value", ["value"]),

  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
