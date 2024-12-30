"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

interface GameRoom {
  gameId: string;
  host: string;
  hostId: string;
  players: Player[];
  viewers: string[];
  gameState: string;
  title: string;
  activePlayer: string;
  showDailyDouble: boolean;
  board: JeopardyGameObject;
  singleBoardState: number[];
  doubleBoardState: number[];
  buzzerDuration: number;
  activeClue: ActiveClue;
  finalClue: FinalClue;
}

interface ClientSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isHost: boolean;
  gameRoom: GameRoom | null;
  activeClue: ActiveClue | null;
  currentPlayer: Player | null;
  resolvedUserId: string | null;
  timerActive: boolean;
  timerDuration: number;
  buzzDuration: number;
  setBuzzDuration: (val: number) => void;
  setTimerDuration: (val: number) => void;
  sendMessage: (
    event: string,
    data: any,
    callback?: (response: any) => void
  ) => void;
}

const ClientSocketContext = createContext<ClientSocketContextValue | undefined>(
  undefined
);

interface ClientSocketProviderProps {
  backendUrl: string;
  children: React.ReactNode;
}

export const ClientSocketProvider: React.FC<ClientSocketProviderProps> = ({
  backendUrl,
  children,
}) => {
  const { user, isLoaded } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [activeClue, setactiveClue] = useState<ActiveClue | null>(null);
  const [timerDuration, setTimerDuration] = useState(10);
  const [buzzDuration, setBuzzDuration] = useState(10);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Initialize user data (either from Clerk or guest)
  useEffect(() => {
    if (!isLoaded) return;
    if (pathname.includes("viewer") && resolvedUserId === null) {
      const newUserId = `VIEWER-${Math.random().toString(36).substring(2, 12)}`;
      setResolvedUserId(newUserId);
      return;
    }
    if (user) {
      // Use Clerk user details
      setResolvedUserId(user.id);
      localStorage.removeItem("guestUserId");
      localStorage.removeItem("guestUsername");
    } else {
      // Generate and store guest userId and username
      const storedUserId = localStorage.getItem("guestUserId");

      if (storedUserId) {
        setResolvedUserId(storedUserId);
      } else {
        const newUserId = `GUEST-${Math.random()
          .toString(36)
          .substring(2, 12)}`;
        localStorage.setItem("guestUserId", newUserId);
        setResolvedUserId(newUserId);
      }
    }
  }, [user, isLoaded]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!resolvedUserId) return;

    const socketConnection = io(backendUrl, {
      query: { userId: resolvedUserId },
    });

    socketConnection.on("connect", () => {
      console.log("Socket.IO connected");
      setIsConnected(true);
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsConnected(false);
    });

    socketConnection.onAny((event: string, data: GameRoom | any) => {
      // Automatically update the game state for specific events
      if (event === "update") {
        setIsHost(data.hostId === resolvedUserId);
        setGameRoom(data);
        // console.log("data: " + JSON.stringify(data));
        const curr = data.players.filter(
          (p: Player) => p.userId === resolvedUserId
        );
        setCurrentPlayer(curr[0]);
        if (data.activeClue) {
          setactiveClue(data.activeClue);
          if (data.activeClue.isBuzzed) setTimerActive(false);
          else setTimerActive(data.activeClue.timer.active);
        } else {
          setactiveClue(null);
          setTimerActive(false);
        }
      } else if (event === "kick") {
        toast({
          title: "KICKED",
          description: data.message,
          variant: "destructive",
        });
        localStorage.removeItem("gameId");
        isMobile ? router.push("/mobile") : router.push("/");
      }
    });

    setSocket(socketConnection);

    // Cleanup on unmount
    return () => {
      console.log("Socket.IO disconnected on cleanup");
      socketConnection.disconnect();
    };
  }, [backendUrl, resolvedUserId]);

  const sendMessage = (
    event: string,
    data: any,
    callback?: (response: any) => void
  ) => {
    if (!socket || !isConnected) {
      console.log("Unable to send message: Socket.IO is not connected");
      toast({
        title: "Connection Error",
        description: "Socket.IO is not connected",
        variant: "destructive",
      });
      return;
    }

    if (!isHost && event === "updateGame") {
      console.log("Unable to send message: User is not host");
      toast({
        title: "User Error",
        description: "User is not host",
        variant: "destructive",
      });
      return;
    }

    socket.emit(event, data, (response: any) => {
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else if (response.response) {
        if (response.game) {
          setIsHost(response.game.hostId === resolvedUserId);
          setGameRoom(response.game);
          // console.log("data: " + JSON.stringify(response.game));
          const curr = response.game.players.filter(
            (p: Player) => p.userId === resolvedUserId
          );
          setCurrentPlayer(curr[0]);
          if (response.game.activeClue) {
            setactiveClue(response.game.activeClue);
            if (response.game.activeClue.isBuzzed) setTimerActive(false);
            else setTimerActive(response.game.activeClue.timer.active);
          } else {
            setactiveClue(null);
            setTimerActive(false);
          }
        }
      }
      if (callback) callback(response);
    });
  };

  return (
    <ClientSocketContext.Provider
      value={{
        socket,
        isConnected,
        isHost,
        gameRoom,
        currentPlayer,
        activeClue,
        resolvedUserId,
        timerActive,
        buzzDuration,
        timerDuration,
        setBuzzDuration,
        setTimerDuration,
        sendMessage,
      }}
    >
      {children}
    </ClientSocketContext.Provider>
  );
};

export const useClientSocket = (): ClientSocketContextValue => {
  const context = useContext(ClientSocketContext);
  if (!context) {
    throw new Error(
      "useClientSocket must be used within a ClientSocketProvider"
    );
  }
  return context;
};
