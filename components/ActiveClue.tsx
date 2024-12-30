"use client";

import React, { useEffect, useState } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { ActiveClueTimer } from "./ActiveClueTimer";
import { checkValidMedia } from "@/app/api/scraper";
import BuzzModal from "./BuzzModal";
import DailyDouble from "./DailyDouble";

const ActiveClue = () => {
  const {
    activeClue,
    gameRoom,
    isHost,
    sendMessage,
    timerActive,
    timerDuration,
  } = useClientSocket();
  const [timerIsUp, setTimerIsUp] = useState(false);
  const [buzzModalOpen, setBuzzModalOpen] = useState(false);
  const [clueHasMedia, setClueMedia] = useState(false);

  useEffect(() => {
    const validateMedia = async () => {
      if (!activeClue?.clue) {
        setClueMedia(false); // Reset if there's no active clue or clue is invalid
        return;
      }

      const media = activeClue.clue.media;

      if (Array.isArray(media)) {
        // Check if any media in the array is valid
        const hasValidMedia = await Promise.any(
          media.map(async (mediaItem) => {
            try {
              return await checkValidMedia(mediaItem);
            } catch {
              return false; // Treat failed validation as invalid
            }
          })
        ).catch(() => false); // If none resolve, it's invalid

        setClueMedia(Boolean(hasValidMedia));
      } else if (typeof media === "string") {
        // Check if the single string media is valid
        try {
          const isValid = media.trim() !== "" && (await checkValidMedia(media));
          setClueMedia(isValid);
        } catch {
          setClueMedia(false);
        }
      } else {
        setClueMedia(false); // Invalid media type
      }
    };

    validateMedia();
  }, []);

  useEffect(() => {
    if (!activeClue) return;
    setBuzzModalOpen(activeClue.isBuzzed);
  }, [activeClue?.isBuzzed]);

  if (!gameRoom || !activeClue) return null;

  const correctModalAnswer = () => {
    // show the correct answer, kill timer, add points and set current player
    setBuzzModalOpen(false);
    setTimerIsUp(true);
    if (!isHost) return;
    // Find the player by playerId
    const playerMatch = gameRoom.players.find(
      (p) => p.userId === activeClue.buzzed
    );

    if (!playerMatch) {
      console.error(`Player with ID ${activeClue.buzzed} not found.`);
      return;
    }

    const updatedActiveClue = {
      ...activeClue,
      isBuzzed: false,
      buzzed: null,
      showQuestion: true,
    };

    // Send the player object and ID in the message
    sendMessage("updatePlayers", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          userId: playerMatch.userId,
          score:
            Number(playerMatch.score) +
            (activeClue.clue.double
              ? Number(playerMatch.wager)
              : Number(activeClue.clue.value)),
        },
      ],
    });
    sendMessage("updateGame", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          activeClue: updatedActiveClue,
        },
        { activePlayer: playerMatch.userId },
      ],
    });
  };

  const incorrectModalAnswer = () => {
    // Find the player by playerId
    setBuzzModalOpen(false);
    if (!isHost) return;
    const playerMatch = gameRoom.players.find(
      (p) => p.userId === activeClue.buzzed
    );

    if (!playerMatch) {
      console.error(`Player with ID ${activeClue.buzzed} not found.`);
      return;
    }

    const updatedActiveClue = {
      ...activeClue,
      isBuzzed: false,
      buzzed: null,
    };

    // Send the player object and ID in the message
    sendMessage("updatePlayers", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          userId: playerMatch.userId,
          score:
            Number(playerMatch.score) -
            (activeClue.clue.double
              ? Number(playerMatch.wager)
              : Number(activeClue.clue.value)),
        },
      ],
    });
    sendMessage("updateGame", {
      gameId: gameRoom.gameId,
      updateObjs: [
        {
          activeClue: updatedActiveClue,
        },
      ],
    });
  };

  const timerComplete = () => {
    setTimerIsUp(true);
    const updatedPlayers = gameRoom?.players.map((p) => {
      return { ...p, buzzerActive: false };
    });
    if (!isHost) return;
    const updatedActiveClue = {
      ...activeClue,
      isBuzzed: false,
      buzzed: null,
    };

    sendMessage("updateGame", {
      gameId: gameRoom?.gameId,
      updateObjs: [
        { players: updatedPlayers },
        { activeClue: updatedActiveClue },
      ],
    });
  };

  const shownDailyDouble = () => {
    return;
  };

  return (
    <div className="flex flex-col relative items-center justify-center h-full w-full m-auto">
      {activeClue.clue.double ? (
        gameRoom.showDailyDouble ? (
          <DailyDouble onSoundComplete={shownDailyDouble} />
        ) : null // DO STUFF HERE
      ) : null}
      <h1 className="absolute top-5 text-white clue-responsive-text text-center text-shadow-h">
        {activeClue.category} - ${activeClue.clue.value}
      </h1>
      <div>
        {/* {timerIsUp || gameRoom.activeClue.showQuestion ?} */}
        <h1 className="text-white main-clue-responsive-text text-center hover:cursor-default text-shadow-h p-[12%]">
          {timerIsUp || activeClue.showQuestion
            ? activeClue.clue.question
            : activeClue.clue.answer}
        </h1>
      </div>
      {timerIsUp || activeClue.showQuestion ? null : (
        <ActiveClueTimer
          sound={true}
          active={timerActive}
          duration={timerDuration}
          setTimerIsUp={timerComplete}
        />
      )}
      <BuzzModal
        isOpen={buzzModalOpen}
        setIsOpen={setBuzzModalOpen}
        onCorrect={correctModalAnswer}
        onIncorrect={incorrectModalAnswer}
      />
    </div>
  );
};

export default ActiveClue;
