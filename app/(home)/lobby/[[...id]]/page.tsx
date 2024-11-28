"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function LobbyPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [host, setHost] = useState<any>(null);

  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) {
    router.push("/");
  }

  useEffect(() => {
    // const fetchPlayers = async () => {
    //   const players = await api.lobbies.getPlayers();
    //   setPlayers(players);
    // };
    // fetchPlayers();
    const dev_players = [
      {
        _id: user?.id + "_1",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_2",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_3",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_4",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_5",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_6",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_7",
        name: user?.username,
        score: 0,
      },
      {
        _id: user?.id + "_8",
        name: user?.username,
        score: 0,
      },
    ];
    setPlayers(dev_players);
  }, []);

  return (
    <section className="home">
      <div className="home-content">
        <Card className="flex flex-col justify-center items-center rounded-lg [perspective:1000px] w-full h-full border-3 border-black-0 bg-blue-heather p-10 no-visible-scrollbar">
          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <Card key={player.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player.avatar} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{player.name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
