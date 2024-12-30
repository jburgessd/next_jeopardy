import Image from "next/image";
import { useEffect, useState } from "react";

interface DailyDoubleProps {
  onSoundComplete: () => void; // Optional callback when the sound completes
}

const DailyDouble: React.FC<DailyDoubleProps> = ({ onSoundComplete }) => {
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [audio] = useState(new Audio("/sounds/dailyDouble.mp3"));
  audio.onended = () => {
    onSoundComplete();
  };
  useEffect(() => {
    if (soundPlayed) return;

    audio.play();
    setSoundPlayed(true);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Image src="/images/dailydouble.webp" alt="dailyDouble" fill />
    </div>
  );
};

export default DailyDouble;
