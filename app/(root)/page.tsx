"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Home = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  if (isSignedIn) router.push("/host-game");
  return (
    <section className="flex flex-col grid-background">
      <div className="absolute z-20 p-8 top-0 right-0">
        <Button
          className="rounded-full p-5 bg-black-1"
          variant="outline"
          asChild
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
      <Spotlight
        className="-top-10 left-0 md:left-40 md:-top-40"
        fill="white"
      />
      <div className="flex flex-row z-20">
        <div className="basis-1/2 justify-content-right text-right p-8">
          <p className="hero-text">
            Welcome to <br /> Host Jeopardy!
          </p>
        </div>
        <div className="basis-1/2">
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
                With this website, you can create and host your own 'Jeopardy!'
                games or compete against your friends in previously aired games.
                You can even game all in one place, just start up a game an cast
                it to a tv screen and scan the QR code on your phone to join the
                game.
                <br /> Sign up to get started!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="flex bg-clue-gradient items-center text-white"
        >
          <Link href="/sign-up">Sign Up</Link>
        </HoverBorderGradient>
      </div>
      <div className="grid-background-gradient" />
    </section>
  );
};

export default Home;
