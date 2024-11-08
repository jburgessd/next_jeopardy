"use server";
import { ArchiveLists } from "@/types";
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
