"use client";
import { gameTemplate } from "@/constants";
import { Clue, CreateGameObject } from "@/types";
import { ReactNode, createContext, useState } from "react";

export type CreateGameObjectContextType = {
  gameObject: CreateGameObject;
  objectIsVerified: boolean;
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
  verifyGameObject: () => (boolean | string)[];
};

export const CreateGameDataContext =
  createContext<CreateGameObjectContextType | null>(null);

const CreateGameDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameObject, setGameObject] = useState<CreateGameObject>(gameTemplate);
  const [objectIsVerified, setObjectIsVerified] = useState(false);

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

  const verifyGameObject = () => {
    if (gameObject === null) {
      return [objectIsVerified, "Game object is null"];
    }
    if (gameObject.title === "" || gameObject.creator === "") {
      return [objectIsVerified, "Title or Creator is empty"];
    }
    if (
      gameObject.jeopardy.length !== 6 ||
      gameObject.doubleJeopardy.length !== 6
    ) {
      return [objectIsVerified, "Jeopardy board is missing categories"];
    }
    if (
      gameObject.jeopardy.some(
        (category) =>
          category.clues.length !== 5 || category.categoryName === ""
      ) ||
      gameObject.doubleJeopardy.some(
        (category) =>
          category.clues.length !== 5 || category.categoryName === ""
      )
    ) {
      return [objectIsVerified, "Jeopardy category is missing clues"];
    }
    if (
      gameObject.finalJeopardy.category === "" ||
      gameObject.finalJeopardy.clue === "" ||
      gameObject.finalJeopardy.media === "" ||
      gameObject.finalJeopardy.response === ""
    ) {
      return [objectIsVerified, "Final Jeopardy category is missing data"];
    }
    for (const category of gameObject.jeopardy) {
      if (
        category.clues.some((clue) => clue.clue === "" || clue.response === "")
      ) {
        return [objectIsVerified, "Jeopardy clue is missing data"];
      }
    }
    for (const category of gameObject.doubleJeopardy) {
      if (
        category.clues.some((clue) => clue.clue === "" || clue.response === "")
      ) {
        return [objectIsVerified, "Double Jeopardy clue is missing data"];
      }
    }
    setObjectIsVerified(true);
    return [objectIsVerified, "Game object is verified"];
  };

  return (
    <CreateGameDataContext.Provider
      value={{
        gameObject,
        objectIsVerified,
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
        verifyGameObject,
      }}
    >
      {children}
    </CreateGameDataContext.Provider>
  );
};

export default CreateGameDataProvider;
