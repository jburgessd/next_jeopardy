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
  final: {
    category: string;
    clue: {
      answer: string;
      media: string[] | string;
      question: string;
    };
  };
}

declare interface ActiveClue {
  clue: Clue;
  category: string;
  buzzed: string[];
  timer: {
    start: bool;
    isUp: bool;
    fromTime: number;
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
