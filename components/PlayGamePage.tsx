import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import GameBoardView from "./GameBoardView";
import Scoreboard from "./Scoreboard";
import DesktopBuzzer from "./DesktopBuzzer";

const PlayGamePage = () => {
  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={75} maxSize={75} minSize={75}>
          <GameBoardView />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <DesktopBuzzer />
        </ResizablePanel>
      </ResizablePanelGroup>
      <Scoreboard />
    </>
  );
};
export default PlayGamePage;
