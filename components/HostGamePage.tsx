import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CurrentAnswerViewer from "./CurrentAnswerViewer";
import HostControlArea from "./HostControlArea";
import Scoreboard from "./Scoreboard";
import GameBoardView from "./GameBoardView";

const HostGamePage = () => {
  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={75} maxSize={75} minSize={60}>
          <GameBoardView />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25} maxSize={25} minSize={25}>
              <CurrentAnswerViewer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <HostControlArea />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Scoreboard />
    </>
  );
};

export default HostGamePage;
