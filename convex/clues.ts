import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { CreatedClue } from "@/types";

export const createClues = mutation({
  args: {
    clues: v.array(
      v.object({
        clue: v.string(),
        media: v.optional(v.string()),
        response: v.string(),
        value: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthorized" + 401 + "You must be signed in to create a clue."
      );
    }
    const ret: CreatedClue[] = [];
    for (const arrayClue of args.clues) {
      // Check if clue exists
      const clueExists = await ctx.db
        .query("clues")
        .filter((q) => q.eq(q.field("clue"), arrayClue.clue))
        .first();
      // if it does, add it to the array
      if (clueExists) {
        ret.push(clueExists);
        // else create the clue
      } else {
        const identity = await ctx.auth.getUserIdentity();
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), identity?.email))
          .collect();
        const newClueId = await ctx.db.insert("clues", {
          clue: arrayClue.clue,
          media: arrayClue.media,
          response: arrayClue.response,
          value: arrayClue.value,
          creator: user[0]._id,
        });
        const newClue = await ctx.db.get(newClueId);
        if (newClue) {
          console.log(newClue);
          ret.push(newClue);
        } else {
          throw new ConvexError("ERROR Creating Clues");
        }
      }
    }
    if (ret.length !== args.clues.length) {
      throw new ConvexError("ERROR Creating Clues");
    }
    return ret;
  },
});

export const getClueById = query({
  args: { clueId: v.id("clues") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clueId);
  },
});
