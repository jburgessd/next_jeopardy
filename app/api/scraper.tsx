"use server";

import { parse } from "node-html-parser";

export async function getInfoArray(link: string | null) {
  const res =
    link === null
      ? await fetch("https://j-archive.com/listseasons.php")
      : await fetch(`https://j-archive.com/${link}`);
  const html = await res.text();
  const root = parse(html);
  const content = root.querySelector("#content");
  if (!content) {
    throw new Error("Content not found");
  }
  const listItems = content.querySelectorAll("a");
  const parsedData = listItems.filter((item) => {
    if (item.parentNode.rawTagName !== "p") return item;
  });
  const data = parsedData.map((item) => {
    const ret = {
      text: item.textContent,
      href: item.getAttribute("href") as string,
    };
    return ret as ArchiveLists;
  });
  return data;
}

export async function checkValidMedia(href: string) {
  if (!href) return false;

  try {
    const response = await fetch(href);
    if (!response.ok) return false;

    const html = await response.text();
    const root = parse(html);
    const title = root.querySelector("title")?.textContent || "";
    return !title.includes("404 Not Found");
  } catch (err) {
    console.error(`Error fetching URL: ${href}`, err);
    return false;
  }
}

export async function getArchiveGameData(link: string) {
  const res = await fetch(`https://j-archive.com/${link}`);
  const html = await res.text();
  const root = parse(html);

  // Extract game title
  const titleElement = root.querySelector("title");
  const name = titleElement ? titleElement.text.trim() : "Unknown Game";

  // Check for content
  const content = root.querySelector("#content");
  if (!content) {
    throw new Error("Content not found");
  }

  // Helper to extract clues for a specific round
  const extractRoundData = (roundId: string, cluePrefix: string) => {
    const mult = cluePrefix.includes("DJ") ? 400 : 200;
    const roundElement = content.querySelector(`#${roundId}`);
    if (!roundElement) {
      return null;
    }

    const categories: Category[] = [];
    const categoryElements = roundElement.querySelectorAll(".category");
    categoryElements.forEach((categoryElement) => {
      const categoryName = categoryElement
        .querySelector(".category_name")
        ?.text.trim();
      categories.push({
        category: categoryName!,
        clues: [],
      });
    });

    const clueElements = roundElement.querySelectorAll(".clue");
    clueElements.forEach(async (clueElement) => {
      const answerElement = clueElement.querySelector(".clue_text");
      const question = "What is "
        .concat(clueElement.querySelector(".correct_response")!.text.trim())
        .concat("?");
      const double = !!clueElement.querySelector(".clue_value_daily_double");
      const mediaElements = answerElement!.querySelectorAll("a");
      const mediaArr = mediaElements.map((med) => {
        const ref = med.getAttribute("href");
        if (ref !== undefined) return ref;
        return "";
      });
      const media = mediaArr.filter((med) => med !== "") || [];

      const answer = answerElement!.text.trim();
      const id = answerElement!.id;
      const rowNum = parseInt(id.split("_")[3].trim(), 10);
      const value = rowNum * mult;
      const colNum = parseInt(id.split("_")[2].trim(), 10);

      // console.log("id: ", id);
      // console.log("value: ", value);
      // console.log("answer: ", answer);
      // console.log("question: ", question);
      // console.log("double: ", double);
      // console.log("media: ", media);

      const clueData: Clue = {
        value: value,
        question: question ? question : "",
        answer: answer ? answer : "",
        media: media,
        double: double,
      };

      if (categories[colNum - 1]) {
        categories[colNum - 1].clues.push(clueData);
      }
    });

    return categories;
  };

  // Extract data for Single, Double, and Final Jeopardy rounds
  const single = extractRoundData("jeopardy_round", "clue_J");
  const double = extractRoundData("double_jeopardy_round", "clue_DJ");

  const finalJeopardyElement = content.querySelector("#final_jeopardy_round");
  const finalCategory = finalJeopardyElement
    ?.querySelector(".category_name")
    ?.text.trim();
  const finalClue = finalJeopardyElement
    ?.querySelector(".clue_text")
    ?.text.trim();
  const question = "What is "
    .concat(
      finalJeopardyElement!.querySelector(".correct_response")!.text.trim()
    )
    .concat("?");

  const final = {
    category: finalCategory!,
    clue: { answer: finalClue!, question: question! },
  };

  const ret = {
    name,
    single,
    double,
    final,
  };
  // console.log(JSON.stringify(ret));
  return ret as JeopardyGameObject;
}
