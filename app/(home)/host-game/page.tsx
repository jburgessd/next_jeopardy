"use client";
import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HostGameProps } from "@/types";
import { createAllArchivedGames } from "@/lib/serverActions";

const Home = async ({ user }: HostGameProps) => {
  return (
    <section className="home">
      <div className="home-content">
        <Card className="game-board rounded-lg justify-between bg-jeopardy-blue-800">
          <Button
            onClick={() => createAllArchivedGames()}
            className="w-full h-full justify-center items-center"
          >
            Create All Archived files
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Home;
