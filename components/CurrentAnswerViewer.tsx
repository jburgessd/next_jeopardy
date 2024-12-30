import React, { useEffect } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Card } from "./ui/card";

const CurrentAnswerViewer = () => {
  const { activeClue } = useClientSocket();

  return (
    <Card
      className="flex items-center justify-center h-full w-full bg-blue-heather border-2 border-black-0 p-4 text-center overflow-hidden"
      style={{
        textTransform: "uppercase",
      }}
    >
      <h1
        className="text-shadow-h break-words clue-responsive-text hover:cursor-default"
        style={{
          wordWrap: "break-word", // Ensures words wrap within the container
          whiteSpace: "normal", // Allows wrapping
          textAlign: "center", // Centers the text horizontally
        }}
      >
        {activeClue?.clue?.question || "No active clue"}
      </h1>
    </Card>
  );
};

export default CurrentAnswerViewer;
