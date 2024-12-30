"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getArchiveGameData, getInfoArray } from "@/app/api/scraper";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClientSocket } from "@/providers/ClientSocketProvider";
import { z } from "zod";

import { HostGameSchema, GameSchema } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import HostFormControl from "@/components/HostFormControl";

type HostGameFormData = z.infer<typeof HostGameSchema>;

const Home = () => {
  const [seasons, setSeasons] = useState<ArchiveLists[]>([]);
  const [episodes, setEpisodes] = useState<ArchiveLists[]>([]);
  const [customFilename, setCustomFileName] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [createdGame, setCreatedGame] = useState(false);
  const { user } = useUser();
  const { sendMessage } = useClientSocket();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const methods = useForm<HostGameFormData>({
    resolver: zodResolver(HostGameSchema),
    defaultValues: {
      base: "",
      game: "",
      gameId: "",
      validGameData: {},
      players: 0,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const gameIdValue = watch("gameId");
  const validGameData = watch("validGameData");
  const baseValue = watch("base");
  const gameValue = watch("game");

  useEffect(() => {
    // Eventually, check and make sure this is the right thing
    if (!errors.gameId && Object.keys(validGameData).length !== 0)
      setSubmitEnabled(true);
    else setSubmitEnabled(false);
  }, [validGameData]);

  useEffect(() => {
    const getGameData = async () => {
      if (gameValue != null && gameValue !== "") {
        const ret = await getArchiveGameData(gameValue);
        setValue("validGameData", GameSchema.parse(ret));
      }
    };
    getGameData();
    console.log("GET GAME DATA");
  }, [gameValue]);

  useEffect(() => {
    const getSeasons = async () => {
      try {
        const res = await getInfoArray(null);
        setSeasons(res);
      } catch (error) {
        console.log(error);
      }
    };
    getSeasons();
    if (!errors.gameId && Object.keys(validGameData).length !== 0)
      setSubmitEnabled(true);
    else setSubmitEnabled(false);
  }, []);

  useEffect(() => {
    const getEpisodes = async () => {
      try {
        const res = await getInfoArray(baseValue!);
        setEpisodes(res);
      } catch (error) {
        console.log(error);
      }
    };
    setEpisodes([]);
    if (baseValue !== "") {
      getEpisodes();
    }
  }, [baseValue]);

  const onHostGameSubmit = () => {
    localStorage.setItem("gameId", gameIdValue);
    sendMessage("createGame", {
      gameId: gameIdValue,
      hostName: user!.username,
      gameBoard: validGameData,
      buzzDuration: 10,
    });
    router.push(`/lobby/${gameIdValue}`);
  };

  const handleImportClick = () => {
    // Trigger the hidden file input when the button is clicked
    fileInputRef.current?.click();
  };

  // updates the game data once it is imported
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return;
    setCustomFileName(e.target.files[0].name);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const res = e.target?.result as string;
      const raw_json = JSON.parse(res);
      setValue("validGameData", raw_json);
    };
  };

  return (
    <section className="home">
      <div className="home-content">
        <Card className="flex flex-col justify-center items-center rounded-lg [perspective:1000px] w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar">
          <div className="absolute flex items-center space-x-2 top-10">
            <Checkbox
              id="created"
              checked={createdGame}
              onCheckedChange={() => setCreatedGame(!createdGame)}
            />
            <label
              htmlFor="created"
              className="text-md leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use a Created Game
            </label>
          </div>
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(onHostGameSubmit)}
              className="space-y-6"
            >
              <FormItem>
                <FormLabel>Game ID</FormLabel>
                <FormControl className="text-black-0">
                  <Input
                    {...register("gameId")}
                    placeholder="Enter Game ID"
                    maxLength={25}
                    aria-invalid={!!errors.gameId}
                  />
                </FormControl>
                {errors.gameId && (
                  <FormMessage>{errors.gameId.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                {createdGame ? (
                  <div>
                    <Button
                      type="button"
                      onClick={handleImportClick}
                      className="flex rounded-full bg-clue-gradient border-black-0 border-2 items-center text-white"
                    >
                      Import Game File
                      <input
                        ref={fileInputRef}
                        onChange={handleChangeFile}
                        hidden
                        type="file"
                        accept=".json,application/json"
                      />
                    </Button>
                    <h1 className="py-2">{customFilename}</h1>
                    {errors.validGameData && (
                      <FormMessage>{errors.validGameData.message}</FormMessage>
                    )}
                  </div>
                ) : (
                  <div>
                    <HostFormControl
                      setValue={setValue}
                      control={control}
                      name="base"
                      label="Seasons"
                      placeholder="Select a Season"
                      empty="No Seasons..."
                      description="Select from any aired Season of 'Jeopardy!'"
                      list={seasons}
                    />
                    {baseValue !== "" ? (
                      <HostFormControl
                        setValue={setValue}
                        control={control}
                        name="game"
                        label="Episodes"
                        placeholder="Select an Episode"
                        empty="No Episodes..."
                        description="Select from any aired Episode of 'Jeopardy!'"
                        list={episodes}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </FormItem>
              <Button
                type="submit"
                disabled={!submitEnabled}
                className={
                  submitEnabled
                    ? "flex rounded-full bg-clue-gradient border-black-0 border-2 items-center text-white"
                    : "flex rounded-full bg-gray-500 border-black-0 border-2 items-center text-white opacity-50"
                }
              >
                Host Game
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
};

export default Home;
