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

const JoinGamePage: React.FC = () => {
  const [resolvedUsername, setResolvedUsername] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Default to closed
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const { isConnected, sendMessage } = useClientSocket();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      setResolvedUsername(user.username!);
    } else {
      setResolvedUsername(localStorage.getItem("guestUsername") || "");
    }
  }, [user, isLoaded]);

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
    if (resolvedUsername === "") {
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
          router.push(`/lobby/${gameId}`);
        }
      }
    );
  };

  return (
    <section className="home">
      <div className="home-content">
        <Card className="flex flex-col justify-items-start items-center rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar">
          <h1 className="flex flex-row text-3xl mb-10 text-shadow-h">
            Available Games
          </h1>
          <div className=" grid grid-cols-1 min-h-[85%] w-[50%]">
            <ScrollArea>
              {rooms.map((room) => (
                <Card
                  key={room.gameId}
                  className="flex flex-row w-full border-2 border-black-0 text-shadow-h bg-clue-gradient p-4 justify-between"
                >
                  <div className="max-w-[80%]">
                    <h2 className="text-lg">{room.title}</h2>
                    <p className="text-md">
                      Host: {room.host.toLocaleUpperCase()} | Players:{" "}
                      {room.playerCount} / 10
                    </p>
                  </div>
                  <div className="flex justify-center items-center px-5">
                    <Button
                      className="flex border-black-0 border-2 text-shadow-h rounded-full bg-blue-700 hover:bg-black-1"
                      onClick={() => joinGame(room.gameId)}
                    >
                      Join Game
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
        </Card>
      </div>
    </section>
  );
};

export default JoinGamePage;
