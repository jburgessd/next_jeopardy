import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ToggleTabsProps {
  options: string[];
  onSelect: (selected: string) => void;
}

const ToggleTabs: React.FC<ToggleTabsProps> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  useEffect(() => {
    setSelectedOption(options[0]);
  }, []);

  return (
    <div className="flex w-full border-none bg-black-0 bg-opacity-20">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => handleSelect(option)}
          className={`flex-1 border-none text-sm max-w-full ${
            selectedOption === option
              ? "bg-blue-500 text-white hover:bg-blue-700 text-shadow-h"
              : "bg-transparent"
          }`}
          style={{ flexBasis: `${100 / options.length}%` }}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default ToggleTabs;
