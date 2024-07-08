import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createBoard = mutation({
  args: {
    board: v.array(v.id("categories")),
  },
  handler: async (ctx, args) => {
    if (args.board.length !== 6) {
      throw new ConvexError(
        "Invalid board, There must be 6 categories in a board"
      );
    }
    const boardExists = await ctx.db
      .query("boards")
      .filter((q) => q.eq(q.field("categories"), args.board))
      .first();
    if (boardExists) {
      return boardExists;
    }
    const boardId: Id<"boards"> = await ctx.db.insert("boards", {
      categories: [
        args.board[0],
        args.board[1],
        args.board[2],
        args.board[3],
        args.board[4],
        args.board[5],
      ],
    });
    if (!boardId) {
      throw new ConvexError("Invalid board, Could not create board");
    }
    const ret = await ctx.db.get(boardId);
    if (!ret) {
      throw new ConvexError("Invalid board, Could not create board");
    }
    return ret;
  },
});

export const getBoardById = query({
  args: { gameId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
