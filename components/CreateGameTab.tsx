"use client";

import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { ChangeEvent, useContext } from "react";
import BoardSquare from "./BoardSquare";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const CreateGameTab = ({
  activeTab = "jeopardy",
}: {
  activeTab: "jeopardy" | "doubleJeopardy" | "finalJeopardy";
}) => {
  const {
    gameObject,
    updateTitle,
    updateCreator,
    updateFinalJeopardyCategory,
    updateFinalJeopardyClue,
    updateFinalJeopardyMedia,
    updateFinalJeopardyResponse,
  } = useContext(CreateGameDataContext) as CreateGameObjectContextType;
  return (
    <>
      {activeTab === "jeopardy" || activeTab === "doubleJeopardy" ? (
        <Card className="board-grid border-black-0 bg-blue-700 border-2">
          {gameObject[activeTab].map((value, index) => (
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
              <Button className="w-full h-16 bg-clue-gradient border-black-0 border-3 text-3xl text-shadow-h">
                Submit Created Game
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default CreateGameTab;
