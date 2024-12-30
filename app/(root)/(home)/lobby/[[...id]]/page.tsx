"use client";

import { Card } from "@/components/ui/card";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import JoinLobby from "@/components/JoinLobby";
import HostGamePage from "@/components/HostGamePage";
import PlayGamePage from "@/components/PlayGamePage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";

const LobbyPage: React.FC = () => {
  const router = useRouter();
  const { gameRoom, isHost, isConnected, sendMessage } = useClientSocket();

  useEffect(() => {
    if (!isConnected) return;
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      sendMessage("getUpdatedGame", { gameId: gameId }, (response) => {
        if (response.error) {
          if (isMobile) router.push("/");
          else router.push("/join-game");
        }
      });
    }
  }, [isHost, isConnected]);

  return (
    <section className="no-scrollbar flex size-full max-h-screen overflow-hidden p-8 pb-16">
      <div className="home-content">
        <Card className="flex flex-col justify-between items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-5 no-visible-scrollbar">
          {gameRoom?.gameState === "IDLE" ? (
            <JoinLobby />
          ) : isHost ? (
            <HostGamePage />
          ) : (
            <PlayGamePage />
          )}
        </Card>
      </div>
    </section>
  );
};

export default LobbyPage;
