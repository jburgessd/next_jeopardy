"use server";

import { api } from "@/convex/_generated/api";
import { CreatedCategory, CreateGameObject } from "@/types/global";
import { useMutation } from "convex/react";

const { exec } = require("node:child_process");

const createClues = useMutation(api.clues.createClues);
const createCategory = useMutation(api.categories.createCategory);
const createBoard = useMutation(api.boards.createBoard);
const archiveGame = useMutation(api.games.archiveGame);

const createGame = async (gameObject: CreateGameObject) => {
  if (gameObject.complete) {
    const createdCategories: CreatedCategory[] = [];
    for (const category of gameObject.jeopardy) {
      const createdClues = await createClues({
        clues: category.clues,
      });
      const createdCategory = await createCategory({
        categoryName: category.categoryName,
        clues: createdClues.map((clue) => clue._id),
      });
      createdCategories.push(createdCategory);
    }

    const createdDoubleCategories: CreatedCategory[] = [];
    for (const category of gameObject.doubleJeopardy) {
      const createdClues = await createClues({
        clues: category.clues,
      });
      const createdCategory = await createCategory({
        categoryName: category.categoryName,
        clues: createdClues.map((clue) => clue._id),
      });
      createdDoubleCategories.push(createdCategory);
    }

    const createdJeopardyBoard = await createBoard({
      board: createdCategories.map((category) => category._id),
    });

    const createdDoubleJeopardyBoard = await createBoard({
      board: createdDoubleCategories.map((category) => category._id),
    });

    const createdGame = await archiveGame({
      title: gameObject.title,
      airDate: gameObject.airDate!,
      jeopardy: createdJeopardyBoard._id,
      doubleJeopardy: createdDoubleJeopardyBoard._id,
      finalJeopardy: {
        category: gameObject.finalJeopardy.category,
        clue: gameObject.finalJeopardy.clue,
        media: gameObject.finalJeopardy.media,
        response: gameObject.finalJeopardy.response,
      },
      plays: gameObject.plays,
    });
  }
};

export const createAllArchivedGames = async (i: number) => {
  const scrape = await exec(
    `python ./lib/scraper.py ${i}`,
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return null;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return null;
      }
      try {
        const gameObject: CreateGameObject = JSON.parse(stdout);
        if (gameObject === null) return;
        createGame(gameObject);
      } catch (error) {
        console.log("Game upload failed: ", error);
        return null;
      }
    }
  );
};

// export const getLatestGame = () => {
//   return;
// };
