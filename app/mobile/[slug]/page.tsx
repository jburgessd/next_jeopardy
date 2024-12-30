"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ButtonPage = () => {
  const [resolvedUsername, setResolvedUsername] = useState(
    localStorage.getItem("guestUsername")
  );
  const [wagerEnabled, setWagerEnabled] = useState(false);
  const [guessEnabled, setGuessEnabled] = useState(false);
  const [canWagerAmount, setCanWagerAmount] = useState(0);
  const [wagerAmount, setWagerAmount] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  const router = useRouter();
  const { activeClue, gameRoom, currentPlayer, isConnected, sendMessage } =
    useClientSocket();

  useEffect(() => {
    if (!resolvedUsername) router.push("/mobile");
    if (!isConnected) return;
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      sendMessage("getUpdatedGame", { gameId: gameId }, (response) => {
        if (response.error) router.push("/");
      });
    }
  }, [isConnected]);

  useEffect(() => {
    if (!currentPlayer || currentPlayer.score < 0 || guessEnabled) {
      console.log("DO NOTHING");
      return;
    }
    if (
      (activeClue?.clue.double &&
        gameRoom?.activePlayer === currentPlayer?.userId) ||
      (gameRoom?.gameState === "FINAL" && gameRoom.finalClue.state === "WAGER")
    )
      setWagerEnabled(true);
    else setWagerEnabled(false);
    if (currentPlayer.score < 1000 && gameRoom?.gameState === "SINGLE") {
      setCanWagerAmount(1000);
    } else if (currentPlayer.score < 2000 && gameRoom?.gameState !== "SINGLE") {
      setCanWagerAmount(2000);
    } else {
      setCanWagerAmount(currentPlayer.score);
    }
  }, [activeClue, gameRoom?.finalClue, gameRoom?.gameState]);

  if (!gameRoom || !currentPlayer) return null;

  const onBuzzPress = () => {
    sendMessage("BUZZ", { gameId: gameRoom.gameId }, (response) => {
      console.log(response);
    });
  };

  const submitWager = () => {
    sendMessage(
      "WAGER",
      { gameId: gameRoom.gameId, wager: wagerAmount },
      (response) => {
        console.log(response);
      }
    );
    setWagerAmount(0);
    setWagerEnabled(false);
    setGuessEnabled(true);
  };

  const submitFinalGuess = () => {
    sendMessage(
      "GUESS",
      { gameId: gameRoom.gameId, guess: finalAnswer },
      (response) => {
        console.log(response);
      }
    );
    setWagerAmount(0);
    setGuessEnabled(false);
    setWagerEnabled(false);
  };

  return (
    <section className="no-scrollbar flex size-full max-h-screen overflow-hidden p-1">
      <div className="home-content">
        <Card className="flex flex-col justify-between items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-2 no-visible-scrollbar">
          <div className="flex flex-col h-[8%] w-full items-center">
            <p
              className="flex text-md text-shadow-h"
              style={{
                textTransform: "uppercase",
              }}
            >
              {resolvedUsername}
            </p>
            <p
              className={`flex ${
                currentPlayer.score < 0 ? "text-negative" : "text-white"
              } text-sm text-shadow-h `}
            >
              ${currentPlayer?.score}
            </p>
          </div>
          {wagerEnabled &&
          (gameRoom.showDailyDouble || gameRoom.gameState === "FINAL") ? (
            <div
              className="justify-items-center w-5/6 h-3/4 space-y-2"
              style={{ textTransform: "uppercase" }}
            >
              <Label className="text-shadow-h text-2xl">
                Wager $1 - ${canWagerAmount}
              </Label>
              <Input
                className="text-black-0"
                type="text"
                inputMode="numeric"
                placeholder={"0"}
                onChange={(e) => {
                  setWagerAmount(
                    e.target.value === "" ||
                      Number(e.target.value) > canWagerAmount
                      ? canWagerAmount
                      : Number(e.target.value) < 1
                      ? 1
                      : Number(e.target.value)
                  );
                }}
              />
              <Button
                className="border-2 border-black-0 bg-clue-gradient text-2xl text-shadow-h rounded-full p-7"
                onClick={submitWager}
              >
                WAGER
              </Button>
            </div>
          ) : guessEnabled && gameRoom.finalClue?.state === "GUESS" ? (
            <>
              <div
                className="items-center justify-items-center w-5/6 h-3/4 space-y-2"
                style={{ textTransform: "uppercase" }}
              >
                <h1 className="text-center text-shadow-h text-2xl">
                  FINAL GUESS
                </h1>
                <p className="text-center text-shadow-h text-lg">
                  (WAGER: {currentPlayer.wager})
                </p>
                <Input
                  className="text-black-0"
                  type="text"
                  placeholder={"Guess"}
                  onChange={(e) => {
                    setFinalAnswer(e.target.value);
                  }}
                />
                <Button
                  className="border-2 border-black-0 bg-clue-gradient text-2xl text-shadow-h rounded-full p-7"
                  onClick={submitFinalGuess}
                >
                  GUESS
                </Button>
              </div>
            </>
          ) : gameRoom.gameState === "FINAL" ? (
            <></>
          ) : (
            <Button
              onClick={onBuzzPress}
              className={
                currentPlayer.buzzerActive
                  ? "w-full h-full rounded bg-clue-gradient items-center"
                  : "w-full h-full rounded bg-gray-500 items-center opacity-50"
              }
            >
              <p className="flex font-korinna text-white text-5xl text-shadow-h">
                BUZZ
              </p>
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
};

export default ButtonPage;
