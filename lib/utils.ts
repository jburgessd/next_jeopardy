import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ArchiveSchema = (type: string) =>
  z.object({
    season: type === "archive" ? z.string() : z.string().optional(),
    episode: type === "archive" ? z.string() : z.string().optional(),
    gameName: z.string(),
    hostGameName: z.string(),
    players: z.number(),
  });
