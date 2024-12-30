import React, { useState } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayIcon, PauseIcon } from "lucide-react";
import ToggleTabs from "./ToggleTabs";

const HostControlArea: React.FC = () => {
  const {
    gameRoom,
    sendMessage,
    activeClue,
    buzzDuration,
    setBuzzDuration,
    timerDuration,
    setTimerDuration,
  } = useClientSocket();

  const [isPlaying, setIsPlaying] = useState(false);
  const [finalTimer, setFinalTimer] = useState(30);
  const [guessTimer, setGuessTimer] = useState(30);

  // Toggle play/pause button
  const togglePlay = () => {
    if (!activeClue && !gameRoom?.finalClue) return;

    setIsPlaying((prev) => !prev);
    if (gameRoom?.finalClue && gameRoom?.finalClue.state === "WAGER") {
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          {
            finalClue: {
              ...gameRoom.finalClue,
              timer: {
                finalActive: !isPlaying,
                finalDuration: finalTimer,
                guessActive: false,
                guessDuration: guessTimer,
              },
            },
          },
        ],
      });
      return;
    }
    if (gameRoom?.finalClue && gameRoom?.finalClue.state === "GUESS") {
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          {
            finalClue: {
              ...gameRoom.finalClue,
              timer: {
                finalActive: false,
                finalDuration: finalTimer,
                guessActive: !isPlaying,
                guessDuration: guessTimer,
              },
            },
          },
        ],
      });
      return;
    } else {
      const updatedActiveClue = {
        ...activeClue,
        buzzerDuration: buzzDuration,
        timer: {
          active: !isPlaying,
          duration: timerDuration,
        },
      };

      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [{ activeClue: updatedActiveClue }],
      });
    }
  };

  // Show the question
  const handleShowQuestion = () => {
    setIsPlaying(false);
    if (!activeClue && gameRoom?.gameState !== "FINAL") return;
    if (gameRoom?.gameState === "FINAL") {
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [{ finalClue: { ...gameRoom.finalClue, state: "GUESS" } }],
      });
      return;
    }
    const updatedActiveClue = {
      ...activeClue,
      showQuestion: true,
    };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [{ activeClue: updatedActiveClue }],
    });
  };

  // Show the board
  const handleGoToBoard = () => {
    if (gameRoom?.gameState === "FINAL") {
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [{ finalClue: { ...gameRoom.finalClue, state: "END" } }],
      });
      return;
    }
    const updatedActiveClue = null;
    handleBuzzersUpdate(false);
    setIsPlaying(false);

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [{ activeClue: updatedActiveClue }],
    });
  };

  // Enable all buzzers
  const handleBuzzersUpdate = (state: boolean) => {
    if (!gameRoom?.players) return;

    const updatedPlayers = gameRoom?.players.map((p) => {
      return { ...p, buzzerActive: state };
    });

    let updatedActiveClue = null;
    if (activeClue) updatedActiveClue = { ...activeClue, isBuzzed: false };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [
        { players: updatedPlayers },
        { activeClue: updatedActiveClue },
      ],
    });
  };

  const handleUpdateGameState = (state: string) => {
    setIsPlaying(false);
    let updatedFinalClue = null;
    let updatedPlayers = gameRoom?.players;
    if (state === "Final") {
      updatedPlayers = gameRoom?.players.map((p) => {
        return { ...p, buzzerActive: false };
      });
      updatedFinalClue = {
        ...gameRoom?.board.final,
        state: "WAGER",
        timer: {
          finalActive: false,
          finalDuration: finalTimer,
          guessActive: false,
          guessDuration: guessTimer,
        },
      };
    }
    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [
        { gameState: state.toLocaleUpperCase() },
        { finalClue: updatedFinalClue },
        { players: updatedPlayers },
      ],
    });
  };

  const handleSetFinalTimes = () => {
    const updatedFinalClue = {
      ...gameRoom?.finalClue,
      timer: {
        finalActive: false,
        finalDuration: finalTimer,
        guessActive: false,
        guessDuration: guessTimer,
      },
    };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [{ gameState: "FINAL" }, { finalClue: updatedFinalClue }],
    });
  };

  return (
    <div className="relative p-2 bg-gray-800 text-sm bg-opacity-50 border-2 border-black-0 text-white space-y-2 h-full w-full">
      <div className="flex items-center space-x-2">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          className="flex items-center bg-blue-500 hover:bg-blue-700"
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </Button>

        {/* Show Question */}
        <Button
          onClick={handleShowQuestion}
          className="flex bg-blue-500 hover:bg-blue-700 w-full"
        >
          {gameRoom?.gameState === "FINAL" ? "Final" : "Reveal"}
        </Button>

        {/* Show Question */}
        <Button
          onClick={handleGoToBoard}
          className="flex bg-blue-500 hover:bg-blue-700 w-full"
        >
          {gameRoom?.gameState === "FINAL" ? "End" : "Board"}
        </Button>
      </div>

      {/* Number Inputs */}
      <div className="flex space-x-2 w-full">
        <div className="space-y-1 w-full">
          <p>Answer Time</p>
          <Input
            type="text"
            inputMode="numeric"
            value={timerDuration}
            onChange={(e) =>
              setTimerDuration(
                e.target.value === "" ? 10 : Number(e.target.value)
              )
            }
            className=" text-black-0 w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <p>Buzzer Time</p>
          <Input
            type="text"
            inputMode="numeric"
            value={buzzDuration}
            onChange={(e) =>
              setBuzzDuration(
                e.target.value === "" ? 10 : Number(e.target.value)
              )
            }
            className=" text-black-0 w-full"
          />
        </div>
      </div>
      <div className="flex space-y-1">
        <div className="space-y-1 w-full">
          <p>Buzzers</p>
          {/* Enable/Disable Buzzers */}
          <div className="flex space-x-2 w-full">
            <Button
              onClick={() => handleBuzzersUpdate(true)}
              className="bg-green-500 hover:bg-green-700 w-full"
            >
              Enable
            </Button>
            <Button
              onClick={() => handleBuzzersUpdate(false)}
              className="bg-red-500 hover:bg-red-600 w-full"
            >
              Disable
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-space-y-1">
        <ToggleTabs
          options={["Single", "Double", "Final"]}
          onSelect={handleUpdateGameState}
        />
      </div>
      {gameRoom?.gameState === "FINAL" ? (
        <div className="flex flex-col space-y-1">
          <div className="flex space-x-2 w-full">
            <div className="space-y-1 w-full">
              <p>Final Time</p>
              <Input
                type="text"
                inputMode="numeric"
                value={finalTimer}
                onChange={(e) =>
                  setFinalTimer(
                    e.target.value === "" ? 30 : Number(e.target.value)
                  )
                }
                className=" text-black-0 w-full"
              />
            </div>
            <div className="space-y-1 w-full">
              <p>Guess Time</p>
              <Input
                type="text"
                inputMode="numeric"
                value={guessTimer}
                onChange={(e) =>
                  setGuessTimer(
                    e.target.value === "" ? 30 : Number(e.target.value)
                  )
                }
                className=" text-black-0 w-full"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSetFinalTimes()}
            className="bg-blue-500 hover:bg-blue-700 w-full"
          >
            Set Final Times
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default HostControlArea;
