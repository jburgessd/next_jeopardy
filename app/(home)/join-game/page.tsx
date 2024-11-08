"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HostGameProps, ArchiveLists } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getInfoArray } from "@/app/api/scraper";
import { z } from "zod";

import { ArchiveSchema, cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import HostFormControl from "@/components/HostFormControl";

const archiveFormSchema = ArchiveSchema("");

const Home = () => {
  const [seasons, setSeasons] = useState<ArchiveLists[]>([]);
  const [episodes, setEpisodes] = useState<ArchiveLists[]>([]);
  const [createdGame, setCreatedGame] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState({
    text: "",
    href: "",
  });
  const [selectedEpisode, setSelectedEpisode] = useState({
    text: "",
    href: "",
  });

  const archiveForm = useForm<z.infer<typeof archiveFormSchema>>({
    resolver: zodResolver(archiveFormSchema),
    defaultValues: {
      season: "",
      episode: "",
      gameName: "",
      hostGameName: "",
      players: 0,
    },
  });

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
        const res = await getInfoArray(selectedSeason.href);
        setEpisodes(res);
      } catch (error) {
        console.log(error);
      }
    };
    setEpisodes([]);
    setSelectedEpisode({ text: "", href: "" });
    if (selectedSeason.href !== "") {
      getEpisodes();
    }
  }, [selectedSeason]);

  const onArchiveSubmit = (data: z.infer<typeof archiveFormSchema>) => {
    console.log("SUBMIT");
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const onCreatedSubmit = (data: z.infer<typeof archiveFormSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
            <Form {...archiveForm}>
              <form
                onSubmit={archiveForm.handleSubmit(onArchiveSubmit)}
                className="space-y-6"
              >
                <HostFormControl
                  form={archiveForm}
                  control={archiveForm.control}
                  name="season"
                  label="Seasons"
                  placeholder="Select a Season"
                  empty="No Seasons..."
                  description="Select from any aired Season of 'Jeopardy!'"
                  list={seasons}
                  setListItem={setSelectedSeason}
                />
                {selectedSeason.href !== "" ? (
                  <HostFormControl
                    form={archiveForm}
                    control={archiveForm.control}
                    name="episode"
                    label="Episodes"
                    placeholder="Select an Episode"
                    empty="No Episodes..."
                    description="Select from any aired Episode of 'Jeopardy!'"
                    list={episodes}
                    setListItem={setSelectedEpisode}
                  />
                ) : (
                  <></>
                )}
                {selectedSeason.href !== "" ? (
                  <Button className="flex rounded-full bg-clue-gradient border-black-0 items-center text-white">
                    <Link href={`/lobby/${id}`}>Host Game</Link>
                  </Button>
                ) : (
                  <></>
                )}
              </form>
            </Form>
          )}
        </Card>
      </div>
    </section>
  );
};

export default Home;
