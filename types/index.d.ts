/* eslint-disable no-unused-vars */

import { Id } from "@/convex/_generated/dataModel";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare interface CreateGameObject {
  title: string;
  airDate?: string;
  creator?: string;
  complete?: boolean;
  jeopardy: Category[];
  doubleJeopardy: Category[];
  finalJeopardy: {
    category: string;
    clue: string;
    media?: string;
    response: string;
  };
  plays?: number;
}

declare interface Clue {
  clue: string;
  media?: string;
  response: string;
  value: number;
}

declare interface CreatedClue {
  clue: string;
  media?: string;
  response: string;
  value: number;
  _id: Id<"clues">;
  _creationTime: number;
  creator: Id<"users">;
}

declare interface Category {
  categoryName: string;
  clues: Clue[];
}

declare interface CreatedCategory {
  categoryName: string;
  clues: Id<"clues">[];
  _id: Id<"categories">;
  _creationTime: number;
}

declare interface CreatedBoard {
  categories: Id<"categories">[];
  _id: Id<"boards">;
  _creationTime: number;
}

declare interface HostGameProps {
  user: User;
}

declare interface TextShadowValues {
  sm: string;
  DEFAULT: string;
  lg: string;
  xl: string;
}

declare type SignUpParams = {
  name: string;
  nickName: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  email: string;
  userId: string;
  name: string;
  nickName: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  nickName: string;
};

declare type Account = {
  id: string;
  name: string;
};

declare type ArchiveLists = {
  text: string;
  href: string;
};

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: UserResource;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
}

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface FooterProps {
  type?: "mobile" | "desktop";
}

declare interface SidebarProps {
  user: UserResource;
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}
