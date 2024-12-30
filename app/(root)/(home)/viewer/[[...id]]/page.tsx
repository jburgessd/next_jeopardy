"use client";

import GameBoardView from "@/components/GameBoardView";
import Scoreboard from "@/components/Scoreboard";
import { Card } from "@/components/ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PassThrough } from "stream";

// Component built so a new tab can be set to another screen, so players can view the game.
const ViewerPage: React.FC = () => {
  const router = useRouter();
  const { isConnected, sendMessage } = useClientSocket();
  const pathname = usePathname();
  const gameId = pathname.slice(-4);

  useEffect(() => {
    if (!isConnected) return;
    if (gameId) {
      sendMessage("getUpdatedGame", { gameId: gameId }, (response) => {
        if (response.error) router.push("/join-game");
      });
    }
  }, [isConnected]);

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
