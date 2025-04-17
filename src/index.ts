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

  const contentPieces: (string | null)[] = [];

  $("main, article, .content, #content, .post, .entry, .page-content")
    .find("h1, h2, h3, h4, h5, h6, p")
    .each((index, element) => {
      contentPieces.push($(element).prop("outerHTML"));
    });

  if (contentPieces.length === 0) {
    $("body")
      .find("h1, h2, h3, h4, h5, h6, p")
      .each((index, element) => {
        // Skip elements that are likely to be in navigation/footer areas
        const parents = $(element).parents(
          "nav, header, footer, sidebar, .sidebar, .navigation, .menu"
        ).length;
        if (parents === 0) {
          contentPieces.push($(element).prop("outerHTML"));
        }
      });
  }

  const contentHTML = contentPieces.join("\n");

  const markdown = turndown.turndown(contentHTML || "");

  return markdown
    .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newlines
    .trim();
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
