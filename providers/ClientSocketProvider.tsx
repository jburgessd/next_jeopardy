"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
  board: JeopardyGameObject;
  boardState: number[];
  activeClue: ActiveClue;
}

interface ClientSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isHost: boolean;
  gameRoom: GameRoom | null;
  currentPlayer: Player | null;
  resolvedUserId: string | null;
  sendMessage: (
    event: string,
    data: any,
    callback?: (response: any) => void
  ) => void;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string, callback: (data: any) => void) => void;
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
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  const pathname = usePathname();
  const subscriptions = useRef<Record<string, Set<(data: any) => void>>>({});
  const router = useRouter();

  // Initialize user data (either from Clerk or guest)
  useEffect(() => {
    if (!isLoaded) return;
    if (pathname.includes("viewer")) {
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
      if (subscriptions.current[event]) {
        subscriptions.current[event].forEach((callback) => callback(data));
      }

      // Automatically update the game state for specific events
      if (event === "update") {
        toast({
          title: event,
          description: JSON.stringify(data.gameState),
        });
        setIsHost(data.hostId === resolvedUserId);
        setGameRoom(data);
        const curr = data.players.filter(
          (p: Player) => p.userId === resolvedUserId
        );
        console.log(curr);
        if (curr) setCurrentPlayer(curr[0]);
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
      console.error("Unable to send message: Socket.IO is not connected");
      toast({
        title: "Connection Error",
        description: "Socket.IO is not connected",
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
          toast({
            title: "Success",
            description: JSON.stringify(response.game.players),
          });
          setIsHost(response.game.hostId === resolvedUserId);
          setGameRoom(response.game);
          const curr = response.game.players.filter(
            (p: Player) => p.userId === resolvedUserId
          );
          if (curr) setCurrentPlayer(curr[0]);
        }
      }
      if (callback) callback(response);
    });
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (!subscriptions.current[event]) {
      subscriptions.current[event] = new Set();
    }
    subscriptions.current[event].add(callback);
  };

  const unsubscribe = (event: string, callback: (data: any) => void) => {
    subscriptions.current[event]?.delete(callback);
    if (subscriptions.current[event]?.size === 0) {
      delete subscriptions.current[event];
    }
  };

  return (
    <ClientSocketContext.Provider
      value={{
        socket,
        isConnected,
        isHost,
        gameRoom,
        currentPlayer,
        resolvedUserId,
        sendMessage,
        subscribe,
        unsubscribe,
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
