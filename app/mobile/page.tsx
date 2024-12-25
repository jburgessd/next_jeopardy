"use client";

import React, { useEffect, useState } from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import GuestUsernameAlertDialog from "@/components/GuestUsernameAlertBox";

interface Room {
  gameId: string;
  title: string;
  host: string;
  playerCount: number;
}

const JoinGamePageMobile: React.FC = () => {
  const [resolvedUsername, setResolvedUsername] = useState(
    localStorage.getItem("guestUsername")
  );
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Default to closed
  const router = useRouter();
  const { isConnected, sendMessage } = useClientSocket();

  useEffect(() => {
    if (!resolvedUsername) setIsOpen(true);
  }, []);

  const handleSetUsername = (username: string) => {
    setResolvedUsername(username);
    localStorage.setItem("guestUsername", username);
    setIsOpen(false);
    if (selectedGame) joinGame(selectedGame);
  };

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    // Fetch the list of rooms when the component mounts
    sendMessage("getGameRooms", {}, (response: any) => {
      if (response.rooms) {
        setRooms(response.rooms);
      } else {
        toast({
          title: "Failed",
          description: "Failed to fetch rooms" + response.error,
          variant: "destructive",
        });
      }
    });
  }, [sendMessage, isConnected]);

  const joinGame = (gameId: string) => {
    setSelectedGame(gameId);
    if (resolvedUsername === "" || !resolvedUsername) {
      setIsOpen(true);
      return;
    }
    // Check the username
    sendMessage(
      "joinGame",
      { gameId, playerName: resolvedUsername },
      (response: any) => {
        if (response.error) {
          console.error("Failed to join game:", response.error);
        } else {
          localStorage.setItem("gameId", gameId);
          router.push(`/mobile/${gameId}`);
        }
      }
    );
  };

  return (
    <section className="no-scrollbar flex size-full max-h-screen overflow-hidden p-2">
      <div className="home-content">
        <Card className="flex flex-col justify-items-start items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-2 no-visible-scrollbar">
          <h1 className="flex flex-row text-3xl mb-10 text-shadow-h">
            Available Games
          </h1>
          <div className=" grid grid-cols-1 min-h-[80%] w-[95%]">
            <ScrollArea>
              {rooms.map((room) => (
                <Card
                  key={room.gameId}
                  className="flex flex-row w-full border-2 border-black-0 text-shadow-h bg-clue-gradient p-4 justify-between"
                >
                  <div className="max-w-[80%]">
                    <h2 className="text-md">{room.title}</h2>
                    <p className="text-sm">
                      Host: {room.host.toLocaleUpperCase()} | Players:{" "}
                      {room.playerCount} / 10
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      className="flex border-black-0 border-2 text-shadow-h rounded-full bg-blue-700 hover:bg-black-1"
                      onClick={() => joinGame(room.gameId)}
                    >
                      Join
                    </Button>
                  </div>
                </Card>
              ))}
            </ScrollArea>
            <AlertDialog open={isOpen}>
              <AlertDialogTrigger asChild>
                {/* Trigger is hidden since dialog defaults to open */}
                <span className="hidden" />
              </AlertDialogTrigger>
              <GuestUsernameAlertDialog onSetUsername={handleSetUsername} />
            </AlertDialog>
          </div>
          <Button
            type="submit"
            onClick={() => setIsOpen(true)}
            className={
              "flex rounded-full text-shadow-h hover:bg-jeopardy-blue-600 bg-clue-gradient border-black-0 border-2 items-center text-white"
            }
          >
            Change Username
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default JoinGamePageMobile;
