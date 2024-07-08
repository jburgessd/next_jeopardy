"use client";

import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext, useState } from "react";
import BoardSquare from "./BoardSquare";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Category, CreatedCategory } from "@/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Loader2 } from "lucide-react";

const CreateGameTab = ({
  activeTab = "jeopardy",
}: {
  activeTab: "jeopardy" | "doubleJeopardy" | "finalJeopardy";
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const createClues = useMutation(api.clues.createClues);
  const createCategory = useMutation(api.categories.createCategory);
  const createBoard = useMutation(api.boards.createBoard);
  const createGame = useMutation(api.games.createGame);

  const {
    gameObject,
    updateTitle,
    updateFinalJeopardyCategory,
    updateFinalJeopardyClue,
    updateFinalJeopardyMedia,
    updateFinalJeopardyResponse,
  } = useContext(CreateGameDataContext) as CreateGameObjectContextType;

  async function uploadGameToDatabase() {
    try {
      if (gameObject === null) return;
      setIsLoading(true);

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

      const createdGame = await createGame({
        title: gameObject.title,
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

      console.log("Game uploaded successfully!");
      setIsLoading(false);
    } catch (error) {
      console.log("Game upload failed: ", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      {activeTab === "jeopardy" || activeTab === "doubleJeopardy" ? (
        <Card className="board-grid border-black-0 bg-blue-700 border-2">
          {gameObject[activeTab].map((value: Category, index: number) => (
            <>
              <BoardSquare
                type="category"
                col={index}
                row={0}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={1}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={2}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={3}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={4}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={5}
                activeTab={activeTab}
              />
            </>
          ))}
        </Card>
      ) : (
        <Card className="flex font-swiss911 text-shadow-h justify-center border-black-0 border-2 w-[100%] h-[100%] bg-pop-up-gradient">
          <div className="grid gap-4 w-[50%]">
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="title" className="text-3xl">
                  Game Title
                </Label>

                <Input
                  id="title"
                  placeholder={
                    gameObject.title == "" ? "Game Title" : gameObject.title
                  }
                  value={gameObject.title}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="category" className="text-3xl">
                  Category
                </Label>

                <Input
                  id="category"
                  placeholder={
                    gameObject.finalJeopardy.category == ""
                      ? "Final Jeopardy Category"
                      : gameObject.finalJeopardy.category
                  }
                  value={gameObject.finalJeopardy.category}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyCategory(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="clue" className="text-3xl">
                  Clue
                </Label>

                <Textarea
                  placeholder={
                    gameObject.finalJeopardy.clue === ""
                      ? "This is a thing that you write"
                      : gameObject.finalJeopardy.clue
                  }
                  value={gameObject.finalJeopardy.clue}
                  className="col-span-2 h-30 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyClue(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="response" className="text-3xl">
                  Response
                </Label>

                <Textarea
                  placeholder={
                    gameObject.finalJeopardy.response === ""
                      ? "What is a clue?"
                      : gameObject.finalJeopardy.response
                  }
                  value={gameObject.finalJeopardy.response}
                  className="col-span-2 h-30 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyResponse(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="category" className="text-3xl">
                  Media (Optional)
                </Label>

                <Input
                  id="media"
                  placeholder={
                    gameObject.finalJeopardy.media == ""
                      ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      : gameObject.finalJeopardy.media
                  }
                  value={gameObject.finalJeopardy.media}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyMedia(e.target.value)}
                />
              </div>

              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="flex bg-clue-gradient items-center text-white"
                onClick={uploadGameToDatabase}
              >
                {isLoading ? (
                  <>
                    Uploading...&nbsp;
                    <Loader2 size={20} color="white" className="animate-spin" />
                  </>
                ) : (
                  "Upload Game"
                )}
              </HoverBorderGradient>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default CreateGameTab;
