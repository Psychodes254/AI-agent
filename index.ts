import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT, getPromptSuggestions } from "./prompts";
import { getFileChangesInDirectoryTool } from "./tools";

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

const main = async () => {
  const suggestions = getPromptSuggestions();
  console.log("Prompt suggestions:");
  suggestions.forEach((suggestion) => console.log(`- ${suggestion}`));

  const firstSuggestion = suggestions[0];

  if (firstSuggestion) {
    // Specify which directory the code review agent should review changes in your prompt
    await codeReviewAgent(firstSuggestion);
  } else {
    console.warn("No suggestions available for code review");
  }
};

main();
