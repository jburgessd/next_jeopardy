import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { ActiveClueTimer } from "./ActiveClueTimer";
import { Button } from "./ui/button";
import { CheckIcon, XIcon } from "lucide-react";

const FinalJeopardy = () => {
  const [wagerTimeIsUp, setWagerTimeIsUp] = useState(false);
  const [guessTimeIsUp, setGuessTimeIsUp] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [revealFinal, setRevealFinal] = useState(false);
  const [finalAudio] = useState(new Audio("/sounds/final.mp3"));
  const [hiddenButtons, setHiddenButtons] = useState<Record<string, boolean>>(
    {}
  );

  const handleHideButtons = (userId: string) => {
    setHiddenButtons((prev) => ({ ...prev, [userId]: true }));
  };

  const { gameRoom, isHost, sendMessage } = useClientSocket();

  const finalDur = gameRoom?.finalClue.timer?.finalDuration || 30;
  const guessDur = gameRoom?.finalClue.timer?.guessDuration || 30;

  useEffect(() => {
    if (soundPlayed || gameRoom?.finalClue.state !== "GUESS") return;
    if (!gameRoom.finalClue.timer?.guessActive) return;
    finalAudio.playbackRate = finalAudio.duration / guessDur;
    finalAudio.play();
    setSoundPlayed(true);

    return () => {
      finalAudio.pause();
      finalAudio.currentTime = 0;
    };
  }, [
    finalAudio,
    gameRoom?.finalClue.state,
    gameRoom?.finalClue.timer?.guessActive,
  ]);

  const finalDurationIsUp = () => {
    setWagerTimeIsUp(true);
    if (!isHost) return;

    const updatedFinalClue = {
      ...gameRoom?.finalClue,
      state: "GUESS",
    };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [{ finalClue: updatedFinalClue }],
    });
  };

  const guessDurationIsUp = () => {
    setGuessTimeIsUp(true);
    if (!isHost) return;

    const updatedFinalClue = {
      ...gameRoom?.finalClue,
      state: "END",
    };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [{ finalClue: updatedFinalClue }],
    });
  };

  const updateFinalScore = (correct: boolean, player: Player) => {
    if (correct) {
      sendMessage("updatePlayers", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          {
            userId: player.userId,
            score: player.score + player.wager,
          },
        ],
      });
    } else {
      sendMessage("updatePlayers", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          {
            userId: player.userId,
            score: player.score - player.wager,
          },
        ],
      });
    }
  };

  const handleEndGame = () => {
    sendMessage("endGame", { gameId: gameRoom?.gameId });
  };

  return (
    <Card className="border-black-0 size-full">
      <div className="flex flex-col relative items-center justify-center h-full w-full m-auto">
        <h1 className="absolute top-5 text-white clue-responsive-text text-center text-shadow-h">
          Final Jeopardy!
        </h1>
        {gameRoom?.finalClue.state === "WAGER" && !wagerTimeIsUp ? (
          // SHOWN INITIALLY
          <>
            <h1 className="text-white main-clue-responsive-text text-center hover:cursor-default text-shadow-h p-[12%]">
              {gameRoom?.finalClue.category}
            </h1>
            <ActiveClueTimer
              active={gameRoom?.finalClue.timer?.finalActive}
              sound={false}
              duration={finalDur}
              setTimerIsUp={finalDurationIsUp}
            />
          </>
        ) : gameRoom?.finalClue.state === "GUESS" && !guessTimeIsUp ? (
          <>
            <h1 className="text-white main-clue-responsive-text text-center hover:cursor-default text-shadow-h p-[12%]">
              {gameRoom?.finalClue.clue.answer}
            </h1>
            <ActiveClueTimer
              active={gameRoom?.finalClue.timer?.guessActive}
              sound={false}
              duration={guessDur}
              setTimerIsUp={guessDurationIsUp}
            />
          </>
        ) : gameRoom?.finalClue.state === "END" ? (
          <>
            <h1
              onClick={() => setRevealFinal(!revealFinal)}
              className="text-white main-clue-responsive-text text-center hover:cursor-default text-shadow-h p-[12%]"
            >
              {revealFinal ? gameRoom?.finalClue.clue.question : "?????"}
            </h1>
            <div className="h-[50%] w-[90%] grid grid-cols-1 grid-rows-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {gameRoom.players.map((player: Player) => (
                <Card
                  key={player.userId + "1"}
                  className="flex flex-col p-4 rounded bg-clue-gradient items-center justify-between border-2 h-full w-full border-black-0 text-shadow-h"
                >
                  <div className="flex flex-col w-full justify-center space-y-1">
                    <p
                      className="text-center text-lg overflow-ellipsis"
                      style={{
                        textTransform: "uppercase",
                      }}
                    >
                      {player.name}
                    </p>
                    <p
                      className="text-center text-sm overflow-ellipsis"
                      style={{
                        textTransform: "uppercase",
                      }}
                    >
                      {player.finalGuess}
                    </p>
                    <p
                      className="text-center text-sm overflow-ellipsis"
                      style={{
                        textTransform: "uppercase",
                      }}
                    >
                      ${player.wager}
                    </p>
                  </div>
                  {isHost && !hiddenButtons[player.userId] ? (
                    <div className="flex flex-row space-x-3 w-full">
                      <Button
                        className="flex bg-green-500 w-full"
                        onClick={() => {
                          updateFinalScore(true, player);
                          handleHideButtons(player.userId); // Hide buttons after action
                        }}
                      >
                        <CheckIcon className="size-full" />
                      </Button>
                      <Button
                        className="flex bg-red-500 w-full"
                        onClick={() => {
                          updateFinalScore(false, player);
                          handleHideButtons(player.userId); // Hide buttons after action
                        }}
                      >
                        <XIcon className="size-full" />
                      </Button>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
            {isHost ? (
              <Button
                className="bg-clue-gradient border-2 border-black-0 rounded-full"
                onClick={() => handleEndGame()}
              >
                End Game
              </Button>
            ) : null}
          </>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default FinalJeopardy;
