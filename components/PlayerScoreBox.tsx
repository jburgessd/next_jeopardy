import React from "react";
import { Card } from "./ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";

const PlayerScoreBox = ({ player }: { player: Player }) => {
  const { gameRoom } = useClientSocket();
  return (
    <Card
      className={`size-full border-2 border-black-0 text-shadow-h ${
        gameRoom?.activePlayer === player.userId
          ? "bg-active"
          : "bg-clue-gradient"
      } justify-items-center`}
    >
      <p
        className=""
        style={{
          textTransform: "uppercase",
        }}
      >
        {player.name}
      </p>
      <p className={player.score < 0 ? "text-negative" : "text-white"}>
        ${player.score}
      </p>
    </Card>
  );
};

export default PlayerScoreBox;
