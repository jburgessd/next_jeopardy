"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ButtonPage = () => {
  const [gameId, setGameId] = useState(localStorage.getItem("gameId"));
  const [resolvedUsername, setResolvedUsername] = useState(
    localStorage.getItem("guestUsername")
  );
  const [buzzerEnabled, setBuzzerEnabled] = useState(false); // Default to closed
  const [wagerEnabled, setWagerEnabled] = useState(false);
  const [wagerAmount, setWagerAmount] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  const router = useRouter();
  const { currentPlayer, isConnected, sendMessage } = useClientSocket();

  useEffect(() => {
    if (!resolvedUsername) router.push("/mobile");
    if (!isConnected) return;
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      sendMessage("getUpdatedGame", { gameId: gameId });
    }
    console.log(currentPlayer);
  }, [isConnected]);

  const onBuzzPress = () => {
    sendMessage("BUZZ", { gameId: gameId });
  };

  return (
    <section className="no-scrollbar flex size-full max-h-screen overflow-hidden p-1">
      <div className="home-content">
        <Card className="flex flex-col justify-between items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-2 no-visible-scrollbar">
          <div className="flex flex-col h-[8%] w-full items-center">
            <p className="flex text-md text-shadow-h">{resolvedUsername}</p>
            <p
              className={`flex ${currentPlayer?.score} < 0 ? "text-negative" : "text-white"
              } text-sm text-shadow-h`}
            >
              ${currentPlayer?.score}
            </p>
          </div>
          <Button
            disabled={!buzzerEnabled}
            onClick={onBuzzPress}
            className={
              buzzerEnabled
                ? "w-full h-full rounded bg-clue-gradient border-black-0 border-2 items-center text-5xl text-shadow-h"
                : "w-full h-full rounded bg-gray-500 border-black-0 border-2 items-center text-5xl text-shadow-h opacity-50"
            }
          >
            BUZZ
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default ButtonPage;
