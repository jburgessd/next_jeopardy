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
        <ResizablePanel defaultSize={80} maxSize={85} minSize={50}>
          <GameBoardView />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={20} maxSize={40} minSize={10}>
              <CurrentAnswerViewer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
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
