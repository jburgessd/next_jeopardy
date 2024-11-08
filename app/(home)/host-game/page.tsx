"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArchiveLists } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getInfoArray } from "@/app/api/scraper";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { ArchiveSchema } from "@/lib/utils";
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

const archiveFormSchema = ArchiveSchema("");
type ArchiveFormData = z.infer<typeof archiveFormSchema>;

const Home = () => {
  const [seasons, setSeasons] = useState<ArchiveLists[]>([]);
  const [episodes, setEpisodes] = useState<ArchiveLists[]>([]);
  const [createdGame, setCreatedGame] = useState(false);

  const router = useRouter();

  const methods = useForm<ArchiveFormData>({
    resolver: zodResolver(archiveFormSchema),
    defaultValues: {
      base: "",
      game: "",
      gameId: "",
      hostGameName: "",
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
  const baseValue = watch("base");
  const gameValue = watch("game");

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

  const onArchiveSubmit = async (data: ArchiveFormData) => {
    console.log(data);
    // Check if the gameId is not taken in the db

    // Create an active game in the db

    // Go to the game page
    router.push(`/lobby/${gameIdValue}`);
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
          {createdGame ? (
            <></>
          ) : (
            <Form {...methods}>
              <form
                onSubmit={handleSubmit(onArchiveSubmit)}
                className="space-y-6"
              >
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl className="text-black-0">
                    <Input
                      {...register("hostGameName")}
                      placeholder="Enter Game Name"
                      maxLength={25}
                      aria-invalid={!!errors.hostGameName}
                    />
                  </FormControl>
                  {errors.hostGameName && (
                    <FormMessage>{errors.hostGameName.message}</FormMessage>
                  )}
                </FormItem>
                <FormItem>
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
                </FormItem>
                {gameValue !== "" ? (
                  <FormItem>
                    <FormLabel>Game ID</FormLabel>
                    <FormControl className="text-black-0">
                      <Input
                        {...register("gameId")}
                        placeholder="Enter 4-character Game ID"
                        maxLength={4}
                        aria-invalid={!!errors.gameId}
                      />
                    </FormControl>
                    {errors.gameId && (
                      <FormMessage>{errors.gameId.message}</FormMessage>
                    )}
                  </FormItem>
                ) : (
                  <></>
                )}
                <Button
                  type="submit"
                  disabled={!methods.formState.isValid}
                  className={
                    methods.formState.isValid
                      ? "flex rounded-full bg-clue-gradient border-black-0 border-2 items-center text-white"
                      : "flex rounded-full bg-gray-500 border-black-0 border-2 items-center text-white opacity-50"
                  }
                >
                  Host Game
                </Button>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </section>
  );
};

export default Home;
