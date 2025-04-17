import { text } from "@clack/prompts";
import isUrl from "is-url";

async function promptURL(): Promise<string | symbol> {
  const input = await text({
    message: "Input a URL",
    validate(input) {
      if (isUrl(input) == false) return "Valid URL is required!";
    },
  });
  return input;
}
