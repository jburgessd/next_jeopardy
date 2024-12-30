import { useEffect } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Card } from "./ui/card";
import ActiveClue from "./ActiveClue";
import FinalJeopardy from "./FinalJeopardy";

const GameBoardView = () => {
  const { activeClue, gameRoom, timerDuration, isHost, sendMessage } =
    useClientSocket();

  // Retrieve the current board based on gameState
  const currentBoard =
    gameRoom?.gameState === "SINGLE"
      ? gameRoom?.board.single
      : gameRoom?.gameState === "DOUBLE"
      ? gameRoom?.board.double
      : null;

  const boardState =
    gameRoom?.gameState === "SINGLE"
      ? gameRoom.singleBoardState
      : gameRoom?.gameState === "DOUBLE"
      ? gameRoom.doubleBoardState
      : [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000];
  // Mark active clue in the boardState
  useEffect(() => {
    if (!gameRoom || !currentBoard) return;
    if (gameRoom.gameState !== "FINAL") {
      if (gameRoom.activeClue?.clue && gameRoom.activeClue.category) {
        const categoryIndex = currentBoard.findIndex(
          (category) => category.category === gameRoom.activeClue.category
        );
        const clueIndex = currentBoard[categoryIndex]?.clues.findIndex(
          (clue) => clue.value === gameRoom.activeClue.clue.value!
        );
        if (categoryIndex >= 0 && clueIndex >= 0) {
          const updatedBoardState = [...boardState];
          updatedBoardState[categoryIndex] |= 1 << clueIndex;
          if (gameRoom.gameState === "SINGLE") {
            // Send updated state to the server
            sendMessage("updateGame", {
              gameId: gameRoom.gameId,
              updateObjs: [{ singleBoardState: updatedBoardState }],
            });
          } else if (gameRoom.gameState === "DOUBLE") {
            // Send updated state to the server
            sendMessage("updateGame", {
              gameId: gameRoom.gameId,
              updateObjs: [{ doubleBoardState: updatedBoardState }],
            });
          }

          console.log(`Active clue updated boardState:`, updatedBoardState);
        }
      }
    }
  }, []);

  // Update the boardState when a clue is clicked
  const handleClueClick = (categoryIndex: number, clueIndex: number) => {
    if (!isHost || !currentBoard) return;

    // Update the corresponding bit in the boardState
    const updatedBoardState = [...boardState];
    updatedBoardState[categoryIndex] |= 1 << clueIndex;

    const updatedPlayers = gameRoom?.players.map((p) => {
      if (currentBoard[categoryIndex].clues[clueIndex].double)
        return { ...p, buzzerActive: false };
      else return { ...p, buzzerActive: true };
    });
    if (gameRoom?.gameState === "SINGLE") {
      // Send updated state to the server
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          { singleBoardState: updatedBoardState },
          {
            activeClue: {
              clue: currentBoard[categoryIndex].clues[clueIndex],
              category: currentBoard[categoryIndex].category,
              buzzed: "",
              isBuzzed: false,
              showQuestion: false,
              timer: {
                active: false,
                duration: timerDuration,
              },
            },
          },
          { players: updatedPlayers },
          {
            showDailyDouble:
              currentBoard[categoryIndex].clues[clueIndex].double,
          },
        ],
      });
    } else if (gameRoom?.gameState === "DOUBLE") {
      // Send updated state to the server
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [
          { doubleBoardState: updatedBoardState },
          {
            activeClue: {
              clue: currentBoard[categoryIndex].clues[clueIndex],
              category: currentBoard[categoryIndex].category,
              buzzed: "",
              isBuzzed: false,
              showQuestion: false,
              timer: {
                active: false,
                duration: timerDuration,
              },
            },
          },
          { players: updatedPlayers },
          {
            showDailyDouble:
              currentBoard[categoryIndex].clues[clueIndex].double,
          },
        ],
      });
    }

    console.log(`Updated boardState:`, updatedBoardState);
  };

  // Update the boardState when a clue is right clicked
  const handleClueReset = (categoryIndex: number, clueIndex: number) => {
    if (!isHost || !currentBoard) return;

    // Update the corresponding bit in the boardState
    const updatedBoardState = [...boardState];
    updatedBoardState[categoryIndex] &= ~(1 << clueIndex);
    if (gameRoom?.gameState === "SINGLE") {
      // Send updated state to the server
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [{ singleBoardState: updatedBoardState }],
      });
    } else if (gameRoom?.gameState === "DOUBLE") {
      // Send updated state to the server
      sendMessage("updateGame", {
        gameId: gameRoom?.gameId,
        updateObjs: [{ doubleBoardState: updatedBoardState }],
      });
    }

    console.log(`Updated boardState:`, updatedBoardState);
  };

  if (!currentBoard && gameRoom?.gameState === "FINAL") {
    return <FinalJeopardy />;
  }

  if (!gameRoom || !currentBoard) return null;

  return (
    <>
      {activeClue?.clue ? (
        // Active clue view
        <ActiveClue />
      ) : (
        // Game board view
        <Card className="board-grid bg-blue-700 border-2 border-black-0">
          {/* Render categories in the first row */}
          {currentBoard.map((category, index) => (
            <div
              key={`category-${index}`}
              className="board-item font-swiss911 bg-clue-gradient px-2 m-0 border-black-0 border-4 break-words text-center"
            >
              <h1 className="category text-shadow-h">{category.category}</h1>
            </div>
          ))}

          {/* Render clues in columns under each category */}
          {Array.from({ length: 5 }).map((_, clueRowIndex) =>
            currentBoard.map((category, categoryIndex) => {
              const clueIndex = clueRowIndex; // Descending order by value
              const clue = category.clues[clueIndex];
              const isHidden = !!(boardState[categoryIndex] & (1 << clueIndex));

              return (
                <button
                  key={`clue-${categoryIndex}-${clueIndex}`}
                  className={`board-item font-swiss911 ${
                    isHost ? "hover:cursor-pointer" : ""
                  } text-shadow-h bg-clue-gradient val-responsive-text text-yellow square m-0 p-0 border-black-0 border-4`}
                  onClick={() => handleClueClick(categoryIndex, clueIndex)}
                  onContextMenu={(e: React.MouseEvent) => {
                    e.preventDefault();
                    handleClueReset(categoryIndex, clueIndex);
                  }}
                  disabled={isHidden || !isHost}
                >
                  {isHidden ? "" : `$${clue?.value || ""}`}
                </button>
              );
            })
          )}
        </Card>
      )}
    </>
  );
};

export default GameBoardView;
