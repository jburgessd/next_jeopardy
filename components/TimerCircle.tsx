import React from "react";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { RadialChart } from "./ui/radial-chart"; // Assuming ShadCN Radial Chart component exists

const TimerCircle: React.FC = () => {
  const { timeLeft } = useClientSocket();

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="absolute bottom-4 left-4 flex items-center justify-center">
      <div className="relative w-32 h-32">
        <RadialChart
          value={progress}
          className="text-blue-500"
          size={120} // Adjust size as needed
          thickness={10} // Adjust thickness of the stroke
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.ceil(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimerCircle;
