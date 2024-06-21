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
    .index("by_date", ["_creationTime"])
    .index("by_plays", ["plays"])
    .index("by_creator", ["creator"])
    .index("by_title", ["title"]),

  boards: defineTable({
    category1: v.id("categories"),
    category2: v.id("categories"),
    category3: v.id("categories"),
    category4: v.id("categories"),
    category5: v.id("categories"),
    category6: v.id("categories"),
  }),

  categories: defineTable({
    categoryName: v.string(),
    clue1: v.id("clues"),
    clue2: v.id("clues"),
    clue3: v.id("clues"),
    clue4: v.id("clues"),
    clue5: v.id("clues"),
  }).index("by_category", ["categoryName"]),
  clues: defineTable({
    clue: v.string(),
    media: v.optional(v.string()),
    response: v.string(),
    value: v.number(),
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
