import React from "react";
import { Card } from "./ui/card";

const PlayerScoreBox = ({ player }: { player: Player }) => {
  return (
    <Card
      className={`size-full border-2 border-black-0 text-shadow-h ${
        player.active ? "bg-active" : "bg-clue-gradient"
      } justify-items-center`}
    >
      <p
        className=""
        style={{
          textTransform: "capitalize",
        }}
      >
        {player.name}
      </p>
      <p className={player.score < 0 ? "text-negative" : "text-white"}>
        $ {player.score}
      </p>
    </Card>
  );
};

export default PlayerScoreBox;
