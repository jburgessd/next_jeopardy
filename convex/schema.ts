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
