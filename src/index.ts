#!/usr/bin/env node
import { text } from "@clack/prompts";
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
