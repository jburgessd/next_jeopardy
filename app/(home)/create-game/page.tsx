"use client";
import CreateGameTab from "@/components/CreateGameTab";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { user } = useUser();
  if (!user?.username) {
    router.push("/sign-in");
  }

  const tabs = [
    {
      title: "Jeopardy",
      value: "jeopardy",
      content: <CreateGameTab activeTab="jeopardy" />,
    },
    {
      title: "Double Jeopardy",
      value: "double-jeopardy",
      content: <CreateGameTab activeTab="doubleJeopardy" />,
    },
    {
      title: "Final Jeopardy",
      value: "final-jeopardy",
      content: <CreateGameTab activeTab="finalJeopardy" />,
    },
  ];

  return (
    <section className="home">
      <Card className="flex flex-col rounded-lg [perspective:1000px] w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar">
        <Tabs
          tabs={tabs}
          contentClassName="pb-10"
          tabClassName="text-shadow-h"
          activeTabClassName="bg-clue-gradient"
        />
      </Card>
    </section>
  );
};

export default Home;
