"use client";

import GameBoardView from "@/components/GameBoardView";
import Scoreboard from "@/components/Scoreboard";
import { Card } from "@/components/ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { useEffect } from "react";

// Component built so a new tab can be set to another screen, so players can view the game.
const ViewerPage: React.FC = () => {
  const { isHost, isConnected, sendMessage } = useClientSocket();

  useEffect(() => {
    if (!isConnected) return;
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      sendMessage("getUpdatedGame", { gameId: gameId });
    }
  }, [isHost, isConnected]);

  return (
    <section className="no-scrollbar flex size-full max-h-screen overflow-hidden p-8 pb-16">
      <div className="home-content">
        <Card className="flex flex-col justify-between items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-5 no-visible-scrollbar">
          <GameBoardView />

          <Scoreboard />
        </Card>
      </div>
    </section>
  );
};

export default ViewerPage;
