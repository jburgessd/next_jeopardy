import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { CreatedCategory } from "@/types/global";
import { Id } from "./_generated/dataModel";

export const createCategory = mutation({
  args: {
    categoryName: v.string(),
    clues: v.array(v.id("clues")),
  },
  handler: async (ctx, args) => {
    const catExists = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("clues"), args.clues))
      .first();
    if (catExists) {
      return catExists as CreatedCategory;
    }
    const catId: Id<"categories"> = await ctx.db.insert("categories", {
      categoryName: args.categoryName,
      clues: args.clues,
    });
    const ret: CreatedCategory | null = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("_id"), catId))
      .first();
    if (!ret) {
      throw new ConvexError("Invalid category, Could not create category");
    }
    return ret;
  },
});

export const getCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  },
});
