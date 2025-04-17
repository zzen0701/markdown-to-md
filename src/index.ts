#!/usr/bin/env node
import { text, spinner } from "@clack/prompts";
import axios from "axios";
import isUrl from "is-url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import clipboard from "clipboardy";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.addRule("removeScripts", {
  filter: ["script", "style", "nav", "footer", "iframe"],
  replacement: () => "",
});

async function promptURL(): Promise<string | symbol> {
  const input = await text({
    message: "Input a URL",
    validate(input) {
      if (isUrl(input) == false) return "Valid URL is required!";
    },
  });
  return input;
}

async function getURL(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching URL:", error.message);
    process.exit(1);
  }
}

async function processMarkdown(html: string) {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside, ads, iframe").remove();
  let content = $("main").length
    ? $("main").html()
    : $("article").length
    ? $("article").html()
    : $("body").html();
  const markdown = turndown.turndown(content || "");
  return markdown.replace(/\n{3,}/g, "\n\n").trim();
}

async function main() {
  const url = await promptURL();
  if (typeof url !== "string") {
    process.exit(0);
  }
  const s = spinner();
  s.start("Fetching webpage");

  const html = await getURL(url);
  s.message("Converting to markdown");

  const markdown = await processMarkdown(html);

  s.message("Copying to clipboard");
  await clipboard.write(markdown);

  s.stop("Markdown copied to clipboard.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
