import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { object, z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ClueSchema = z.object({
  answer: z.string(),
  media: z.union([z.string(), z.array(z.string())]).optional(),
  question: z.string(),
  value: z.number(),
  double: z.boolean(),
});

const CategorySchema = z.object({
  category: z.string(),
  clues: z.array(ClueSchema),
});

export const GameSchema = z.object({
  name: z.string(),
  single: z.array(CategorySchema),
  double: z.array(CategorySchema),
  final: z.object({
    category: z.string(),
    clue: z.object({
      answer: z.string(),
      media: z.union([z.string(), z.array(z.string())]).optional(),
    }),
  }),
});

export const HostGameSchema = z.object({
  base: z.string().optional(),
  game: z.string().optional(),
  gameId: z
    .string()
    .min(4, { message: "Game ID must be exactly 4 characters." })
    .max(4, { message: "Game ID must be exactly 4 characters." })
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Game ID can only contain letters and digits.",
    }),
  validGameData: GameSchema,
  players: z.number(),
});
