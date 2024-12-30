import { useClientSocket } from "@/providers/ClientSocketProvider";
import PlayerScorePopover from "./PlayerScorePopover";

const Scoreboard = () => {
  const { gameRoom } = useClientSocket();

  if (!gameRoom?.players) return null;
  return (
    <>
      {gameRoom.players.length > 0 ? (
        <div className={`fixed bottom-0 w-[82%] `}>
          <div
            className="grid gap-0 border-2 border-black-0 "
            style={{
              gridTemplateColumns: `repeat(${gameRoom.players.length}, 1fr)`, // Dynamically set grid columns
              gridTemplateRows: "repeat(1, 1fr)",
            }}
          >
            {gameRoom.players.map((p) => (
              <div key={p.userId} className={`grid-item bg-black-0`}>
                <PlayerScorePopover player={p} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Scoreboard;
