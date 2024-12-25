import React, { useEffect } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Card } from "./ui/card";

const CurrentAnswerViewer = () => {
  const { gameRoom } = useClientSocket();

  useEffect(() => {}, [gameRoom?.activeClue]);

  return (
    <Card
      className="flex items-center justify-center h-full w-full bg-blue-heather border-2 border-black-0 p-4 text-center overflow-hidden"
      style={{
        textTransform: "uppercase",
      }}
    >
      <h1
        className="text-shadow-h break-words clue-responsive-text"
        style={{
          wordWrap: "break-word", // Ensures words wrap within the container
          whiteSpace: "normal", // Allows wrapping
          textAlign: "center", // Centers the text horizontally
        }}
      >
        {gameRoom?.activeClue?.clue?.question || "No active clue"}
      </h1>
    </Card>
  );
};

export default CurrentAnswerViewer;
