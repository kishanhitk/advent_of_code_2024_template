import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { green, yellow, red } from "picocolors";

function getInputInstructions(day: string, year = "2024"): string {
  const paddedDay = day.padStart(2, "0");
  return `
${yellow("To get your input file:")}
1. Go to ${green(`https://adventofcode.com/${year}/day/${parseInt(day)}/input`)}
2. Copy your input data
3. Create file: ${green(`src/day${paddedDay}/input.txt`)}
4. Paste your input data into the file

${yellow(
  "Note:"
)} If you're not logged in, you'll need to log in to get your personal input.
Each user gets different input data, so make sure to use your own!
`;
}

export function readInput(day: string): string {
  const inputPath = join(process.cwd(), "src", `day${day}`, "input.txt");

  if (!existsSync(inputPath)) {
    throw new Error(
      `${red("Input file not found!")}\n` + getInputInstructions(day)
    );
  }

  try {
    const content = readFileSync(inputPath, "utf-8").trim();
    if (!content) {
      throw new Error(
        `${red("Input file is empty!")}\n` + getInputInstructions(day)
      );
    }
    return content;
  } catch (error) {
    if (error instanceof Error) {
      // If it's our custom error with instructions, throw as is
      if (error.message.includes("To get your input file:")) {
        throw error;
      }
      // Otherwise, add instructions
      throw new Error(
        `${red(`Failed to read input file: ${error.message}`)}\n` +
          getInputInstructions(day)
      );
    }
    throw error;
  }
}

export function readLines(day: string): string[] {
  return readInput(day).split("\n");
}

export function readNumbers(day: string): number[] {
  return readLines(day).map(Number);
}

// Helper function to validate if a string contains only numbers
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

// Helper function to validate if a string contains only numbers and specific characters
export function containsOnly(str: string, allowedChars: string): boolean {
  const regex = new RegExp(`^[${allowedChars}]+$`);
  return regex.test(str);
}
