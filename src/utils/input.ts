import { readFileSync } from "fs";
import { join } from "path";

export function readInput(day: string): string {
  const inputPath = join(process.cwd(), "src", `day${day}`, "input.txt");
  return readFileSync(inputPath, "utf-8").trim();
}

export function readLines(day: string): string[] {
  return readInput(day).split("\n");
}

export function readNumbers(day: string): number[] {
  return readLines(day).map(Number);
}
