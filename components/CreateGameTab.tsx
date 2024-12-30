"use client";

import { Card } from "./ui/card";
import {
  CreateGameDataContext,
  CreateGameObjectContextType,
} from "./CreateGameDataContext";
import { useContext, useState } from "react";
import BoardSquare from "./BoardSquare";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateGameTab = ({
  activeTab = "single",
}: {
  activeTab: "single" | "double" | "final";
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    gameObject,
    updateTitle,
    updateFinalJeopardyCategory,
    updateFinalJeopardyClue,
    updateFinalJeopardyMedia,
    updateFinalJeopardyResponse,
    verifyGameObject,
  } = useContext(CreateGameDataContext) as CreateGameObjectContextType;

  async function saveGameLocally() {
    try {
      if (gameObject === null) return;
      setIsLoading(true);
      // const ver = verifyGameObject();
      // if (!ver[0]) {
      //   setIsLoading(false);
      //   toast({
      //     title: "Error",
      //     description: ver[1],
      //     variant: "destructive",
      //   });
      //   return;
      // }
      // Add functionality to save the game as a JSON
      const jsonString = JSON.stringify(gameObject, null, 2);

      // Create a blob with the JSON string and set its type
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gameObject.name}.json`; // File name
      document.body.appendChild(a); // Append to body
      a.click(); // Trigger click event
      document.body.removeChild(a); // Remove from body

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
      console.log("Game uploaded successfully!");
      setIsLoading(false);
    } catch (error) {
      console.log("Game upload failed: ", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      {activeTab === "single" || activeTab === "double" ? (
        <Card className="board-grid border-black-0 bg-blue-700 border-2">
          {gameObject[activeTab].map((value: Category, index: number) => (
            <>
              <BoardSquare
                type="category"
                col={index}
                row={0}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={1}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={2}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={3}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={4}
                activeTab={activeTab}
              />
              <BoardSquare
                type="clue"
                col={index}
                row={5}
                activeTab={activeTab}
              />
            </>
          ))}
        </Card>
      ) : (
        <Card className="flex font-swiss911 text-shadow-h justify-center border-black-0 border-2 w-[100%] h-[100%] bg-pop-up-gradient">
          <div className="grid gap-4 w-[50%]">
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="title" className="text-3xl">
                  Game Title
                </Label>

                <Input
                  id="title"
                  placeholder={
                    gameObject.name == "" ? "Game Title" : gameObject.name
                  }
                  value={gameObject.name}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="category" className="text-3xl">
                  Category
                </Label>

                <Input
                  id="category"
                  placeholder={
                    gameObject.final.category == ""
                      ? "Final Jeopardy Category"
                      : gameObject.final.category
                  }
                  value={gameObject.final.category}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyCategory(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="clue" className="text-3xl">
                  Clue
                </Label>

                <Textarea
                  placeholder={
                    gameObject.final.clue.answer === ""
                      ? "This is a thing that you write"
                      : gameObject.final.clue.answer
                  }
                  value={gameObject.final.clue.answer}
                  className="col-span-2 h-30 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyClue(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="response" className="text-3xl">
                  Response
                </Label>

                <Textarea
                  placeholder={
                    gameObject.final.clue.question === ""
                      ? "What is a clue?"
                      : gameObject.final.clue.question
                  }
                  value={gameObject.final.clue.question}
                  className="col-span-2 h-30 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyResponse(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="category" className="text-3xl">
                  Media (Optional)
                </Label>

                <Input
                  id="media"
                  placeholder={
                    gameObject.final.clue.media?.length === 0
                      ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      : gameObject.final.clue.media[0] || ""
                  }
                  value={gameObject.final.clue.media}
                  className="col-span-2 h-16 text-xl text-black-0"
                  onChange={(e) => updateFinalJeopardyMedia(e.target.value)}
                />
              </div>

              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="flex bg-clue-gradient items-center text-white"
                onClick={saveGameLocally}
              >
                {isLoading ? (
                  <>
                    ...&nbsp;
                    <Loader2 size={20} color="white" className="animate-spin" />
                  </>
                ) : (
                  "Save Game"
                )}
              </HoverBorderGradient>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default CreateGameTab;
