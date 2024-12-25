"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const Home = () => {
  return (
    <section className="flex flex-row bg-blue-heather bg-cover bg-center">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row">
          <div className="basis-1/2 justify-content-right text-right p-8">
            <p className="hero-text">
              Welcome to <br /> Host Jeopardy!
            </p>
          </div>
          <div className="basis-1/2 justify-center items-center p-8 mt-8">
            <Card className="max-w-[65%] bg-clue-gradient rounded-lg">
              <CardHeader>
                <CardTitle className="text-3xl text-white">
                  Host your own 'Jeopardy!' games!
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Channel your inner Alex Trebek or Ken Jennings!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white text-wrap">
                  With this website, you can create and host your own
                  'Jeopardy!' games or compete against your friends in
                  previously aired games. You can even game all in one place,
                  just start up a game an cast it to a tv screen and scan the QR
                  code on your phone to join the game.
                  <br /> Sign up to get started!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <SignedOut>
          <div className="flex flex-row justify-center items-center">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="flex bg-clue-gradient items-center text-white"
            >
              <Link href="/sign-up">Sign Up</Link>
            </HoverBorderGradient>
          </div>
        </SignedOut>
      </div>
    </section>
  );
};

export default Home;
