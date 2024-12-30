"use client";

import { useEffect, useState } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const JoinLobby = () => {
  const { gameRoom, isHost, isConnected, sendMessage } = useClientSocket();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !gameRoom) return;
    sendMessage("getUpdatedGame", { gameId: gameRoom.gameId });
  }, []);

  const removePlayer = (playerId: string) => {
    sendMessage("removePlayer", {
      gameId: gameRoom?.gameId,
      playerUserId: playerId,
    });
  };

  const onStartGame = () => {
    sendMessage(
      "updateGame",
      {
        gameId: gameRoom?.gameId,
        updateObjs: [{ gameState: "SINGLE" }],
      },
      (resp: any) => {
        if (resp.response) {
          window.open(
            `/viewer/${gameRoom?.gameId}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }
    );
  };

  if (!gameRoom) return null;

  return (
    <>
      {/* Players Grid */}
      <h1 className="flex flex-row text-3xl mb-4 text-shadow-h">
        {gameRoom?.title}
      </h1>
      <div className="h-[40%] w-[80%] grid grid-cols-1 grid-rows-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {gameRoom.players.map((player: Player) => (
          <Card
            key={player.userId + "1"}
            className="flex flex-col p-6 rounded bg-clue-gradient justify-between border-2 h-full w-full border-black-0 text-shadow-h"
          >
            <div className="flex flex-row w-full justify-center px-2">
              <p
                className="text-2xl overflow-ellipsis"
                style={{
                  textTransform: "uppercase",
                }}
              >
                {player.name}
              </p>
            </div>
            {isHost ? (
              <Button
                onClick={() => removePlayer(player.userId)}
                className="flex flex-row rounded-full bg-red-700 hover:bg-red-950 border-2 border-black-0"
              >
                Remove
              </Button>
            ) : (
              <></>
            )}
          </Card>
        ))}
      </div>
      <Button
        type="button"
        onClick={onStartGame}
        className={`flex rounded-full bg-clue-gradient border-black-0 border-2 items-center text-white
        ${isHost ? "visibility-visible" : "invisible"}`}
      >
        Start Game
      </Button>
    </>
  );
};

export default JoinLobby;
