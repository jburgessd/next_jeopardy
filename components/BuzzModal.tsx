import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { ActiveClueTimer } from "./ActiveClueTimer";

interface BuzzModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  onCorrect: () => void;
  onIncorrect: () => void;
}

const BuzzModal: React.FC<BuzzModalProps> = ({
  isOpen,
  setIsOpen,
  onCorrect,
  onIncorrect,
}) => {
  const { isHost, gameRoom, activeClue } = useClientSocket();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!activeClue) return;
    const playerMatch = gameRoom?.players.find(
      (p) => p.userId === activeClue.buzzed
    );
    if (playerMatch) setName(playerMatch.name);
  }, [activeClue?.isBuzzed]);

  if (!gameRoom) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onIncorrect}>
      {isOpen ? (
        <div className="fixed inset-0 bg-black-0 bg-opacity-50 z-40" />
      ) : null}
      <DialogContent className="flex flex-col justify-between text-center w-[30%] h-fit bg-blue-heather border-black-0 border-2">
        <DialogTitle
          className="flex justify-center text-shadow-h w-full main-clue-responsive-text font-korinna"
          style={{ textTransform: "uppercase" }}
        >
          {name}
        </DialogTitle>
        {isHost ? (
          <div className="space-x-4 items-center justify-center">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={onCorrect}
            >
              Correct
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={onIncorrect}
            >
              Incorrect
            </Button>
          </div>
        ) : null}
        <ActiveClueTimer
          duration={gameRoom.buzzerDuration}
          setTimerIsUp={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BuzzModal;
