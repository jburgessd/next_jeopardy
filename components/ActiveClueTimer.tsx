import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface ActiveClueTimerProps {
  active?: boolean;
  sound?: boolean;
  duration: number;
  setTimerIsUp: (timerIsUp: boolean) => void; // Correct typing for the prop
}

export const ActiveClueTimer: React.FC<ActiveClueTimerProps> = ({
  active = true,
  sound = false,
  duration,
  setTimerIsUp,
}) => {
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [audio] = useState(new Audio("/sounds/timer.mp3"));
  audio.onended = () => {
    setTimerIsUp(true);
  };
  const playSound = () => {
    if (soundPlayed) return;

    audio.play();
    setSoundPlayed(true);
  };

  return (
    <div className="absolute bottom-4 left-4">
      <CountdownCircleTimer
        isPlaying={active}
        duration={duration}
        colors={["#008000", "#FFCC00", "#FF0000"]}
        colorsTime={[duration, duration / 2, 3]}
        size={75}
        strokeWidth={8}
        onComplete={(totalElapsedTime) => {
          if (sound) playSound();
          else setTimerIsUp(true);
        }}
      >
        {({ remainingTime }) => (
          <div className="text-center text-lg">{remainingTime}</div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};
