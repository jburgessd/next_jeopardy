"use client";
import HeaderBox from "@/components/HeaderBox";
import { Card } from "@/components/ui/card";

const Home = async ({ user }: HostGameProps) => {
  return (
    <section className="home">
      <div className="home-content">
        <Card className="game-board rounded-lg justify-between bg-jeopardy-blue-800"></Card>
      </div>
    </section>
  );
};

export default Home;
