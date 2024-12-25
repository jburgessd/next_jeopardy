import React, { useEffect, useState } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { Card } from "./ui/card";

const GameBoardView = () => {
  const { gameRoom, isHost, sendMessage } = useClientSocket();

  if (!gameRoom) return null;

  // Retrieve the current board based on gameState
  const currentBoard =
    gameRoom?.gameState && gameRoom?.board
      ? gameRoom.gameState === "SINGLE"
        ? gameRoom.board.single
        : gameRoom.gameState === "DOUBLE"
        ? gameRoom.board.double
        : null
      : null;

  const boardState = gameRoom.boardState || [
    0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000,
  ];

  // Update the boardState when a clue is clicked
  const handleClueClick = (categoryIndex: number, clueIndex: number) => {
    if (!isHost || !currentBoard) return;

    // Update the corresponding bit in the boardState
    const updatedBoardState = [...boardState];
    updatedBoardState[categoryIndex] |= 1 << clueIndex;

    const updatedPlayers = gameRoom.players.map((p) => {
      return { ...p, buzzerActive: true };
    });

    // Send updated state to the server
    sendMessage("updateGame", {
      gameId: gameRoom.gameId,
      updateObjs: [
        { boardState: updatedBoardState },
        {
          activeClue: {
            clue: currentBoard[categoryIndex].clues[clueIndex],
            category: currentBoard[categoryIndex],
            buzzed: [],
            timer: {
              start: false,
              isUp: false,
              fromTime: 10,
              currTime: 10,
            },
          },
        },
        { players: updatedPlayers },
      ],
    });

    console.log(`Updated boardState:`, updatedBoardState);
  };

  if (!gameRoom || !currentBoard) return null;

  // Mark active clue in the boardState
  useEffect(() => {
    if (gameRoom.activeClue?.clue && gameRoom.activeClue.category) {
      const categoryIndex = currentBoard.findIndex(
        (category) => category.category === gameRoom.activeClue.category
      );
      const clueIndex = currentBoard[categoryIndex]?.clues.findIndex(
        (clue) => clue.value === gameRoom.activeClue.clue.value
      );

      if (categoryIndex >= 0 && clueIndex >= 0) {
        const updatedBoardState = [...boardState];
        updatedBoardState[categoryIndex] |= 1 << clueIndex;

        // Send updated state to the server
        sendMessage("updateGame", {
          gameId: gameRoom.gameId,
          updateObjs: [{ boardState: updatedBoardState }],
        });

        console.log(`Active clue updated boardState:`, updatedBoardState);
      }
    }
  }, [gameRoom.activeClue]);

  //TODO: CHANGE THIS to be a function that is called at the end of a round
  useEffect(() => {
    if (gameRoom.gameState !== "SINGLE") {
      sendMessage("updateGame", {
        gameId: gameRoom.gameId,
        updateObjs: [
          {
            boardState: [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
          },
        ],
      });
    }
  }, [gameRoom.gameState]);

  return (
    <>
      {gameRoom.activeClue?.clue ? (
        // Active clue view
        <div className="flex items-center justify-center h-full w-full">
          <h1 className="text-white main-clue-responsive-text text-center text-shadow-h p-[12%]">
            {gameRoom.activeClue.timer.isUp
              ? gameRoom.activeClue.clue.question
              : gameRoom.activeClue.clue.answer}
          </h1>
        </div>
      ) : (
        // Game board view
        <Card className="grid grid-cols-6 gap-0 size-full bg-blue-700 border-2 border-black-0">
          {/* Render categories in the first row */}
          {currentBoard.map((category, index) => (
            <div
              key={`category-${index}`}
              className="board-item font-swiss911 bg-clue-gradient cat-responsive-text text-shadow-h p-x-2 m-0 border-black-0 border-4 break-words text-center h-"
            >
              {category.category}
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
                  className={`board-item font-swiss911 text-shadow-h bg-clue-gradient val-responsive-text text-yellow square m-0 p-0 border-black-0 border-4`}
                  onClick={() => handleClueClick(categoryIndex, clueIndex)}
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
