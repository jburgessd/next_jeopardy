"use client";
import { gameTemplate } from "@/constants";
import { ReactNode, createContext, useState } from "react";

export type CreateGameObjectContextType = {
  gameObject: JeopardyGameObject;
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
  const [gameObject, setGameObject] =
    useState<JeopardyGameObject>(gameTemplate);
  const [objectIsVerified, setObjectIsVerified] = useState(false);

  const updateTitle = (title: string) => {
    setGameObject((prevState) => ({ ...prevState, name: title }));
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
        ...prevState.single.slice(0, categoryIndex),
        {
          ...prevState.single[categoryIndex],
          clues: [
            ...prevState.single[categoryIndex].clues.slice(0, clueIndex),
            clue,
            ...prevState.single[categoryIndex].clues.slice(clueIndex + 1),
          ],
        },
        ...prevState.single.slice(categoryIndex + 1),
      ],
    }));
  };

  const updateJeopardyCategoryName = (
    categoryName: string,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.single[categoryIndex].category = categoryName;
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
      newGameObject.double[categoryIndex].clues[clueIndex] = clue;
      return newGameObject;
    });
  };

  const updateDoubleJeopardyCategoryName = (
    categoryName: string,
    categoryIndex: number
  ) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.double[categoryIndex].category = categoryName;
      return newGameObject;
    });
  };

  const updateFinalJeopardyCategory = (category: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.final.category = category;
      return newGameObject;
    });
  };

  const updateFinalJeopardyClue = (answer: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.final.clue.answer = answer;
      return newGameObject;
    });
  };

  const updateFinalJeopardyMedia = (media: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.final.clue.media = [media];
      return newGameObject;
    });
  };

  const updateFinalJeopardyResponse = (question: string) => {
    setGameObject((prevState) => {
      const newGameObject = { ...prevState };
      newGameObject.final.clue.question = question;
      return newGameObject;
    });
  };

  const verifyGameObject = () => {
    if (gameObject === null) {
      return [objectIsVerified, "Game object is null"];
    }
    if (gameObject.name === "") {
      return [objectIsVerified, "Title is empty"];
    }
    if (gameObject.single.length !== 6 || gameObject.double.length !== 6) {
      return [objectIsVerified, "Jeopardy board is missing categories"];
    }
    if (
      gameObject.single.some(
        (category) => category.clues.length !== 5 || category.category === ""
      ) ||
      gameObject.double.some(
        (category) => category.clues.length !== 5 || category.category === ""
      )
    ) {
      return [objectIsVerified, "Jeopardy category is missing clues"];
    }
    if (
      gameObject.final.category === "" ||
      gameObject.final.clue.answer === "" ||
      gameObject.final.clue.question === ""
    ) {
      return [objectIsVerified, "Final Jeopardy category is missing data"];
    }
    for (const category of gameObject.single) {
      if (
        category.clues.some(
          (clue) => clue.answer === "" || clue.question === ""
        )
      ) {
        return [objectIsVerified, "Jeopardy clue is missing data"];
      }
    }
    for (const category of gameObject.double) {
      if (
        category.clues.some(
          (clue) => clue.answer === "" || clue.question === ""
        )
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
