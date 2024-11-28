import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ArchiveSchema = (type: string) =>
  z.object({
    base: z.string().optional(),
    game: z.string().optional(),
    createdGameId: z.string().uuid().optional(),
    gameId: z
      .string()
      .min(4, { message: "Game ID must be exactly 4 characters." })
      .max(4, { message: "Game ID must be exactly 4 characters." })
      .regex(/^[A-Za-z0-9]+$/, {
        message: "Game ID can only contain letters and digits.",
      }),
    hostGameName: z
      .string()
      .min(1, { message: "Game Name is required." })
      .max(25, { message: "Game Name must be less than 25 characters." }),
    players: z.number(),
  });
