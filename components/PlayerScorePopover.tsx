import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import PlayerScoreBox from "./PlayerScoreBox";
import { Input } from "./ui/input";
import { useClientSocket } from "@/providers/ClientSocketProvider";

const PlayerScorePopover = ({ player }: { player: Player }) => {
  const { gameRoom, isHost, sendMessage } = useClientSocket();

  const [scoreChangeValue, setScoreChangeValue] = useState<string>();

  useEffect(() => {
    if (!gameRoom) return;
    // Find the player by playerId
    const playerMatch = gameRoom.players.find(
      (p) => p.userId === player?.userId
    );

    if (!playerMatch) {
      console.error(`Player with ID ${player.userId} not found.`);
      return;
    }

    setScoreChangeValue(playerMatch.score.toString());
  }, [gameRoom?.players]);

  const updatePlayerScore = (isOpen: boolean) => {
    if (isOpen || !scoreChangeValue) return;
    if (!gameRoom || !gameRoom.players) {
      console.error("No game room or players available.");
      return;
    }

    // Find the player by playerId
    const playerMatch = gameRoom.players.find(
      (p) => p.userId === player?.userId
    );

    if (!playerMatch) {
      console.error(`Player with ID ${player.userId} not found.`);
      return;
    }

    // Send the player object and ID in the message
    sendMessage("updatePlayers", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          userId: player?.userId,
          score: scoreChangeValue,
        },
      ],
    });
  };

  const setActivePlayer = () => {
    if (!gameRoom || !gameRoom.players) {
      console.error("No game room or players available.");
      return;
    }

    // Find the player by playerId
    const playerMatch = gameRoom.players.find(
      (p) => p.userId === player?.userId
    );

    if (!playerMatch) {
      console.error(`Player with ID ${player.userId} not found.`);
      return;
    }

    // Send the player object and ID in the message
    sendMessage("updateGame", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          activePlayer: playerMatch.userId,
        },
      ],
    });
  };

  return (
    <>
      {isHost ? (
        <Popover onOpenChange={(open) => updatePlayerScore(open)}>
          <PopoverTrigger asChild>
            <Button
              size="full"
              className="size-full"
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                setActivePlayer();
              }}
            >
              <PlayerScoreBox player={player} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="border-black-0 bg-clue-gradient font-korinna text-shadow-h">
            <div className="grid gap-4 ">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Score</h4>
                <p className="text-sm text-muted-foreground">
                  Set the score for the player
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Input
                    className="text-black-0 col-span-2"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter the new score"
                    value={scoreChangeValue}
                    onChange={(e) => setScoreChangeValue(e.target.value)}
                  />
                  {/* <Button
                    className="col-span-2"
                    onClick={() => changeScoreValue()}
                  >
                    Update Score
                  </Button> */}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <PlayerScoreBox player={player} />
      )}
    </>
  );
};

export default PlayerScorePopover;
