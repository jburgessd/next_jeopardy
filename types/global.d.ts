/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare interface JeopardyGameObject {
  name: string;
  single: Category[];
  double: Category[];
  final: FinalClue;
}

declare interface ActiveClue {
  clue: Clue;
  category: string;
  buzzed: string;
  isBuzzed: boolean;
  showQuestion: boolean;
  timer: {
    active: boolean;
    duration: number;
  };
}

declare interface FinalClue {
  category: string;
  state?: string;
  clue: {
    answer: string;
    media: string[] | string;
    question: string;
  };
  timer?: {
    finalActive: boolean;
    finalDuration: number;
    guessActive: boolean;
    guessDuration: number;
  };
}

declare interface Clue {
  answer: string;
  media: string | string[];
  question: string;
  value: number;
  double: boolean;
}

declare interface Category {
  category: string;
  clues: Clue[];
}

declare interface Player {
  userId: string;
  name: string;
  score: number;
  wager: number;
  finalGuess?: string;
  buzzerActive: boolean;
  active: boolean;
}

declare type ArchiveLists = {
  text: string;
  href: string;
};

declare interface MobileNavProps {
  user: UserResource;
}
