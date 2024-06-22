"use client";
import { gameTemplate } from "@/constants";
import { ReactNode, createContext, useState } from "react";

interface CreateGameObject {
  title: string;
  airDate?: Date;
  creator: string;
  jeopardy: Category[];
  doubleJeopardy: Category[];
  finalJeopardy: {
    category: string;
    clue: string;
    media: string;
    response: string;
  };
  plays?: number;
}

export type CreateGameObjectContextType = {
  gameObject: CreateGameObject;
  updateTitle: (title: string) => void;
  updateCreator: (creator: string) => void;
  updateJeopardyClue: (
    clue: Clue,
    clueIndex: number,
    categoryIndex: number
  ) => void;
  updateJeopardyCategoryName: (
    categoryName: string,
    categoryIndex: number
  ) => void;
  updateDoubleJeopardyClue: (
    clue: Clue,
    clueIndex: number,
    categoryIndex: number
  ) => void;
  updateDoubleJeopardyCategoryName: (
    categoryName: string,
    categoryIndex: number
  ) => void;
  updateFinalJeopardyCategory: (category: string) => void;
  updateFinalJeopardyClue: (clue: string) => void;
  updateFinalJeopardyMedia: (media: string) => void;
  updateFinalJeopardyResponse: (response: string) => void;
};

export const CreateGameDataContext =
  createContext<CreateGameObjectContextType | null>(null);

const CreateGameDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameObject, setGameObject] = useState<CreateGameObject>(gameTemplate);

  const updateTitle = (title: string) => {
    setGameObject((prevState) => ({ ...prevState, title }));
  };

  const updateCreator = (creator: string) => {
    setGameObject((prevState) => ({ ...prevState, creator }));
  };

  const updateJeopardyClue = (
    clue: Clue,
    clueIndex: number,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => ({
      ...prevState,
      jeopardy: [
        ...prevState.jeopardy.slice(0, categoryIndex),
        {
          ...prevState.jeopardy[categoryIndex],
          clues: [
            ...prevState.jeopardy[categoryIndex].clues.slice(0, clueIndex),
            clue,
            ...prevState.jeopardy[categoryIndex].clues.slice(clueIndex + 1),
          ],
        },
        ...prevState.jeopardy.slice(categoryIndex + 1),
      ],
    }));
  };

  const updateJeopardyCategoryName = (
    categoryName: string,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.jeopardy[categoryIndex].categoryName = categoryName;
      return newGameObject;
    });
  };

  const updateDoubleJeopardyClue = (
    clue: Clue,
    clueIndex: number,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.doubleJeopardy[categoryIndex].clues[clueIndex] = clue;
      return newGameObject;
    });
  };

  const updateDoubleJeopardyCategoryName = (
    categoryName: string,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.doubleJeopardy[categoryIndex].categoryName = categoryName;
      return newGameObject;
    });
  };

  const updateFinalJeopardyCategory = (category: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.finalJeopardy.category = category;
      return newGameObject;
    });
  };

  const updateFinalJeopardyClue = (clue: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.finalJeopardy.clue = clue;
      return newGameObject;
    });
  };

  const updateFinalJeopardyMedia = (media: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.finalJeopardy.media = media;
      return newGameObject;
    });
  };

  const updateFinalJeopardyResponse = (response: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.finalJeopardy.response = response;
      return newGameObject;
    });
  };

  return (
    <CreateGameDataContext.Provider
      value={{
        gameObject,
        updateTitle,
        updateCreator,
        updateJeopardyClue,
        updateJeopardyCategoryName,
        updateDoubleJeopardyClue,
        updateDoubleJeopardyCategoryName,
        updateFinalJeopardyCategory,
        updateFinalJeopardyClue,
        updateFinalJeopardyMedia,
        updateFinalJeopardyResponse,
      }}
    >
      {children}
    </CreateGameDataContext.Provider>
  );
};

export default CreateGameDataProvider;
