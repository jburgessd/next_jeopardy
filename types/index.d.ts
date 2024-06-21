/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare interface Clue {
  clue: string;
  media: string;
  response: string;
  value: number;
}

declare interface Category {
  categoryName: string;
  clues: Clue[];
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
