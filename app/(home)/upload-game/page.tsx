"use client";
import { Card } from "@/components/ui/card";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Loader2, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { CreateGameObject, CreatedCategory } from "@/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-white">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-300">JSON Jeopardy! Game File (.json)</p>
    </>
  );
};

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameObject, setGameObject] = useState<CreateGameObject | null>(null);

  const createClues = useMutation(api.clues.createClues);
  const createCategory = useMutation(api.categories.createCategory);
  const createBoard = useMutation(api.boards.createBoard);
  const createGame = useMutation(api.games.createGame);

  const dropZoneConfig = {
    accept: { "application/json": [".json"] },
    maxFiles: 1,
    maxSize: 1000000,
    multiple: false,
  } satisfies DropzoneOptions;

  async function parseUploadedFile() {
    if (uploadedFile === null) return;
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const obj = JSON.parse(
          event.target?.result as string
        ) as CreateGameObject;
        obj.plays = 0;
        setGameObject(obj);
      };
      fileReader.readAsText(uploadedFile[0], "UTF-8");
    } catch (error) {
      console.log("Game upload failed: ", error);
    }
  }

  async function uploadGameToDatabase() {
    try {
      if (gameObject === null) return;
      setIsLoading(true);

      const createdCategories: CreatedCategory[] = [];
      for (const category of gameObject.jeopardy) {
        const createdClues = await createClues({
          clues: category.clues,
        });
        const createdCategory = await createCategory({
          categoryName: category.categoryName,
          clues: createdClues.map((clue) => clue._id),
        });
        createdCategories.push(createdCategory);
      }

      const createdDoubleCategories: CreatedCategory[] = [];
      for (const category of gameObject.doubleJeopardy) {
        const createdClues = await createClues({
          clues: category.clues,
        });
        const createdCategory = await createCategory({
          categoryName: category.categoryName,
          clues: createdClues.map((clue) => clue._id),
        });
        createdDoubleCategories.push(createdCategory);
      }

      const createdJeopardyBoard = await createBoard({
        board: createdCategories.map((category) => category._id),
      });

      const createdDoubleJeopardyBoard = await createBoard({
        board: createdDoubleCategories.map((category) => category._id),
      });

      const createdGame = await createGame({
        title: gameObject.title,
        jeopardy: createdJeopardyBoard._id,
        doubleJeopardy: createdDoubleJeopardyBoard._id,
        finalJeopardy: {
          category: gameObject.finalJeopardy.category,
          clue: gameObject.finalJeopardy.clue,
          media: gameObject.finalJeopardy.media,
          response: gameObject.finalJeopardy.response,
        },
        plays: gameObject.plays,
      });

      setIsLoading(false);
      setUploadedFile(null);
      setGameObject(null);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    uploadGameToDatabase();
  }, [gameObject]);

  return (
    <section className="home">
      <Card className="flex flex-col rounded-lg w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar items-center">
        <h1 className="text-center text-shadow-h text-4xl font-bold mb-10">
          Upload Game
        </h1>
        <div className="grid w-full max-w-sm items-center gap-2">
          <FileUploader
            value={uploadedFile}
            onValueChange={setUploadedFile}
            dropzoneOptions={dropZoneConfig}
            className="relative bg-background rounded-lg p-2"
          >
            <FileInput className="outline-dashed outline-1 outline-white">
              <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                <FileSvgDraw />
              </div>
            </FileInput>
            <FileUploaderContent>
              {uploadedFile &&
                uploadedFile.length > 0 &&
                uploadedFile.map((uploadedFile, i) => (
                  <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current" />
                    <span>{uploadedFile.name}</span>
                  </FileUploaderItem>
                ))}
            </FileUploaderContent>
          </FileUploader>
        </div>
        {uploadedFile && uploadedFile.length > 0 ? (
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="flex bg-clue-gradient items-center text-white"
            onClick={parseUploadedFile}
          >
            {isLoading ? (
              <>
                Uploading...&nbsp;
                <Loader2 size={20} color="white" className="animate-spin" />
              </>
            ) : (
              "Upload Game"
            )}
          </HoverBorderGradient>
        ) : null}
      </Card>
    </section>
  );
};

export default Home;
