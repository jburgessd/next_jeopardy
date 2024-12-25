"use client";
import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const BoardSquare = ({
  type = "clue",
  col,
  row,
  activeTab,
}: {
  type: "clue" | "category";
  col: number;
  row: number;
  activeTab: "single" | "double";
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
      ? gameObject[activeTab][col].clues[row - 1].answer !== "" &&
        gameObject[activeTab][col].clues[row - 1].question !== ""
        ? true
        : false
      : gameObject[activeTab][col].category !== ""
      ? true
      : false
  );

  const [clue, setClue] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].answer : ""
  );
  const [response, setResponse] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].question : ""
  );
  const [media, setMedia] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].media : ""
  );
  const [double, setDouble] = useState(
    type === "clue" ? gameObject[activeTab][col].clues[row - 1].double : false
  );

  const handleCloseAutoFocus = () => {
    if (type === "category") {
      if (gameObject[activeTab][col].category !== "") setIsFilled(true);
    } else {
      if (clue !== "" && response !== "") {
        setIsFilled(true);
        const update: Clue = {
          answer: clue,
          question: response,
          media: media,
          value: gameObject[activeTab][col].clues[row - 1].value,
          double: double,
        };
        if (activeTab === "single") {
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
          className={`board-item font-swiss911 text-shadow-h square m-0 p-0 border-black-0 border-4 hover:cursor-pointer ${
            isFilled ? "bg-clue-gradient" : "bg-gray-gradient"
          }`}
        >
          {type === "category" ? (
            <div className="category hover:cursor-pointer">
              {gameObject[activeTab][col].category}
            </div>
          ) : (
            <h1
              className={`values hover:cursor-pointer ${
                isFilled ? "text-yellow" : "text-gray-600"
              } `}
            >
              {gameObject[activeTab][col].clues[row - 1].value}
            </h1>
          )}
        </Card>
      </PopoverTrigger>
      <PopoverContent
        className="font-swiss911 text-shadow-h pop-up w-[20vw] bg-pop-up-gradient border-black-0 border-2"
        onCloseAutoFocus={handleCloseAutoFocus}
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
                  value={gameObject[activeTab][col].category}
                  className="col-span-2 h-8 text-base text-black-0"
                  onChange={(e) => {
                    activeTab === "single"
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
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="double" className="text-base">
                    Daily Double
                  </Label>
                  <Checkbox
                    checked={double}
                    className="col-span-2 text-base text-white"
                    onCheckedChange={() => setDouble(!double)}
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
