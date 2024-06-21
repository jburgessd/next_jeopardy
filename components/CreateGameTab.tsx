"use client";

import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext } from "react";
import BoardSquare from "./BoardSquare";

const CreateGameTab = ({
  activeTab = "jeopardy",
}: {
  activeTab: "jeopardy" | "doubleJeopardy" | "finalJeopardy";
}) => {
  const { gameObject, updateTitle, updateCreator } = useContext(
    CreateGameDataContext
  ) as CreateGameObjectContextType;
  return (
    <>
      {activeTab === "jeopardy" || activeTab === "doubleJeopardy" ? (
        <Card className="grid grid-cols-6 border-black-0 bg-blue-700 border-2 w-full h-full">
          {gameObject[activeTab].map((value, index) => (
            <div className="grid grid-col w-[100%] h-[100%]">
              <BoardSquare
                type="category"
                col={index}
                row={0}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
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
            </div>
          ))}
        </Card>
      ) : (
        <Card className="border-black-0 border-2">TEMP 3</Card>
      )}
    </>
  );
};

export default CreateGameTab;
