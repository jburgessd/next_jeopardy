"use client";
import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext, useEffect, useState } from "react";

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
  console.log("col: ", col);
  console.log("row: ", row);

  const {
    gameObject,
    updateJeopardyClue,
    updateJeopardyCategoryName,
    updateDoubleJeopardyClue,
    updateDoubleJeopardyCategoryName,
  } = useContext(CreateGameDataContext) as CreateGameObjectContextType;

  const [isFilled, setIsFilled] = useState(false);

  // useEffect(() => {
  //   if (type === "category") {
  //     gameObject[activeTab][col].categoryName === ""
  //       ? setIsFilled(false)
  //       : setIsFilled(true);
  //   } else {
  //     const vals = Object.values(gameObject[activeTab][col].clues[row]);
  //     vals.every((val) => !val) ? setIsFilled(false) : setIsFilled(true);
  //   }
  // });

  return (
    <Card
      className={`grid grid-row square m-0 p-0 border-black-0 border-4 ${isFilled ? "bg-clue-gradient" : "bg-gray-gradient"} w-full max-h-[100%] justify-center items-center`}
    >
      {type === "category" ? (
        <button className="font-swiss911 category text-shadow-h">
          {gameObject[activeTab][col].categoryName}
        </button>
      ) : (
        <h1
          className={`font-swiss911 text-5xl text-shadow-h ${isFilled ? "text-yellow" : "text-gray-600"} `}
        >
          {gameObject[activeTab][col].clues[row].value}
        </h1>
      )}
    </Card>
  );
};

export default BoardSquare;
