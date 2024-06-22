"use client";
import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import CustomInput from "./CustomInput";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { set } from "react-hook-form";

const BoardSquare = ({
  type = "clue",
  col,
  row,
  activeTab,
}: {
  type: "clue" | "category";
  col: number;
  row: number;
  activeTab: "jeopardy" | "doubleJeopardy";
}) => {
  const {
    gameObject,
    updateJeopardyClue,
    updateJeopardyCategoryName,
    updateDoubleJeopardyClue,
    updateDoubleJeopardyCategoryName,
  } = useContext(CreateGameDataContext) as CreateGameObjectContextType;

  const [isFilled, setIsFilled] = useState(
    type === "clue"
      ? gameObject[activeTab][col].clues[row - 1].clue !== "" &&
        gameObject[activeTab][col].clues[row - 1].response !== ""
        ? true
        : false
      : gameObject[activeTab][col].categoryName !== ""
        ? true
        : false
  );

  const [clue, setClue] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].clue : ""
  );
  const [response, setResponse] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].response : ""
  );
  const [media, setMedia] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].media : ""
  );

  const handleCloseAutoFocus = () => {
    if (type === "category") {
      if (gameObject[activeTab][col].categoryName !== "") setIsFilled(true);
      return true;
    } else {
      if (clue !== "" && response !== "") {
        setIsFilled(true);
        const update = {
          clue: clue,
          response: response,
          media: media,
          value: gameObject[activeTab][col].clues[row - 1].value,
        };
        if (activeTab === "jeopardy") {
          updateJeopardyClue(update, row - 1, col);
        } else {
          updateDoubleJeopardyClue(update, row - 1, col);
        }
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card
          style={{ gridColumnStart: col + 1, gridRowStart: row + 1 }}
          className={`board-item font-swiss911 text-shadow-h square m-0 p-0 border-black-0 border-4 hover:cursor-pointer ${isFilled ? "bg-clue-gradient" : "bg-gray-gradient"}`}
        >
          {type === "category" ? (
            <div className="category hover:cursor-pointer">
              {gameObject[activeTab][col].categoryName}
            </div>
          ) : (
            <h1
              className={`values hover:cursor-pointer ${isFilled ? "text-yellow" : "text-gray-600"} `}
            >
              {gameObject[activeTab][col].clues[row - 1].value}
            </h1>
          )}
        </Card>
      </PopoverTrigger>
      <PopoverContent
        className="font-swiss911 text-shadow-h pop-up w-[20vw] bg-pop-up-gradient border-black-0 border-2"
        onCloseAutoFocus={() => handleCloseAutoFocus()}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="text-2xl leading-none">
              {type === "category" ? "Category Name" : "Clue"}
            </h4>
            {type === "category" ? (
              <p className="text-gray-400">Set the name of the category</p>
            ) : (
              <p className="text-gray-400">
                Set the desired clue and response
                <br />
                (media URL is optional)
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name" className="text-base">
                {type === "category" ? "Category" : "Clue"}
              </Label>
              {type === "category" ? (
                <Input
                  id="name"
                  placeholder="Category Name"
                  value={gameObject[activeTab][col].categoryName}
                  className="col-span-2 h-8 text-base text-black-0"
                  onChange={(e) => {
                    activeTab === "jeopardy"
                      ? updateJeopardyCategoryName(e.target.value, col)
                      : updateDoubleJeopardyCategoryName(e.target.value, col);
                  }}
                />
              ) : (
                <Textarea
                  placeholder="This is a thing that you write"
                  value={clue}
                  className="col-span-2 h-30 text-base text-black-0"
                  onChange={(e) => setClue(e.target.value)}
                />
              )}
            </div>
            {type === "clue" ? (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="response" className="text-base">
                    Response
                  </Label>
                  <Textarea
                    placeholder="What is a clue?"
                    value={response}
                    className="col-span-2 h-30 text-base text-black-0"
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="media" className="text-base">
                    Media
                  </Label>
                  <Textarea
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={media}
                    className="col-span-2 h-8 text-base text-black-0"
                    onChange={(e) => setMedia(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BoardSquare;
