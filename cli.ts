#!/usr/bin/env bun
import { Command } from "commander";
import { mkdir, writeFile, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";
import { fetchProblem, generateProblemMd } from "./src/utils/problem-fetcher";

const program = new Command();

program
  .name("aoc")
  .description("CLI tool for Advent of Code 2024")
  .version("1.0.0");

// Create new day command
program
  .command("new")
  .argument("<day>", "day number (1-25)")
  .option("--no-fetch", "skip fetching problem statement")
  .description("Create a new day scaffold")
  .action(async (day: string, options: { fetch: boolean }) => {
    const dayNum = parseInt(day);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
      console.error("Day must be a number between 1 and 25");
      process.exit(1);
    }

    const paddedDay = day.padStart(2, "0");
    const dayPath = join(process.cwd(), "src", `day${paddedDay}`);

    if (existsSync(dayPath)) {
      console.error(`Day ${paddedDay} already exists!`);
      process.exit(1);
    }

    console.log(`🎄 Creating scaffold for day ${paddedDay}...`);

    await mkdir(dayPath, { recursive: true });

    const solutionContent = `import { readInput, readLines } from '../utils/input';

const day = '${paddedDay}';

function part1(input: string): number {
    // TODO: Implement part 1
    return 0;
}

function part2(input: string): number {
    // TODO: Implement part 2
    return 0;
}

if (import.meta.main) {
    const input = readInput(day);
    console.log(\`Day \${day} Part 1: \${part1(input)}\`);
    console.log(\`Day \${day} Part 2: \${part2(input)}\`);
}

export { part1, part2 };`;

    const testContent = `import { describe, expect, test } from "bun:test";
import { readInput } from '../utils/input';
import { part1, part2 } from './solution';

const day = '${paddedDay}';

describe('Day ${paddedDay}', () => {
    const example = \`EXAMPLE_INPUT_HERE\`;  // Replace with example input

    test('part 1 - example', () => {
        expect(part1(example)).toBe(0);  // Replace with expected result
    });

    test('part 1 - input', () => {
        const input = readInput(day);
        expect(part1(input)).toBe(0);  // Replace with expected result
    });

    test('part 2 - example', () => {
        expect(part2(example)).toBe(0);  // Replace with expected result
    });

    test('part 2 - input', () => {
        const input = readInput(day);
        expect(part2(input)).toBe(0);  // Replace with expected result
    });
});`;

    // Create files
    await writeFile(join(dayPath, "solution.ts"), solutionContent);
    await writeFile(join(dayPath, "test.ts"), testContent);
    await writeFile(join(dayPath, "input.txt"), "");

    // Fetch and create problem.md
    if (options.fetch) {
      try {
        console.log("📥 Fetching problem statement...");
        const problemData = await fetchProblem(dayNum);
        const problemMd = generateProblemMd(problemData);
        await writeFile(join(dayPath, "problem.md"), problemMd);
        console.log("✨ Problem statement fetched and saved!");
      } catch (error) {
        console.error("Failed to fetch problem statement:", error);
        console.log("Creating template problem.md instead...");
        const templateProblemMd = `# Day ${dayNum}: Title Goes Here

## Part One

[Problem statement goes here]

## Part Two

[Problem statement goes here]

## Notes

- Example input:
\`\`\`
EXAMPLE_INPUT_HERE
\`\`\`

- Expected output (Part 1): X
- Expected output (Part 2): Y

## Approach

### Part 1
- [ ] Step 1
- [ ] Step 2

### Part 2
- [ ] Step 1
- [ ] Step 2

## Solution Stats

### Part 1
- Time: XX ms
- Memory: XX MB

### Part 2
- Time: XX ms
- Memory: XX MB`;
        await writeFile(join(dayPath, "problem.md"), templateProblemMd);
      }
    }

    console.log(`\n✨ Created scaffold for day ${paddedDay}`);
    console.log(`📝 Add your puzzle input to src/day${paddedDay}/input.txt`);
    if (!options.fetch) {
      console.log(`📖 Add problem statement to src/day${paddedDay}/problem.md`);
    }
    console.log(`🚀 Run solution: bun aoc run ${dayNum}`);
    console.log(`🧪 Run tests: bun aoc test ${dayNum}`);
  });

// Run solution command
program
  .command("run")
  .argument("[day]", "day number (1-25)")
  .description("Run solution for a specific day or all days")
  .action((day?: string) => {
    if (day) {
      const dayNum = parseInt(day);
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
        console.error("Day must be a number between 1 and 25");
        process.exit(1);
      }
      const paddedDay = day.padStart(2, "0");
      const solutionPath = join("src", `day${paddedDay}`, "solution.ts");

      if (!existsSync(solutionPath)) {
        console.error(`Solution for day ${paddedDay} not found!`);
        process.exit(1);
      }

      console.log(`🎄 Running solution for day ${paddedDay}...\n`);
      spawnSync("bun", ["run", solutionPath], { stdio: "inherit" });
    } else {
      // Run all implemented solutions
      console.log("🎄 Running all implemented solutions...\n");
      for (let i = 1; i <= 25; i++) {
        const paddedDay = i.toString().padStart(2, "0");
        const solutionPath = join("src", `day${paddedDay}`, "solution.ts");
        if (existsSync(solutionPath)) {
          console.log(`\n📅 Day ${paddedDay}:`);
          spawnSync("bun", ["run", solutionPath], { stdio: "inherit" });
        }
      }
    }
  });

// Test command
program
  .command("test")
  .argument("[day]", "day number (1-25)")
  .option("-w, --watch", "watch mode")
  .description("Run tests for a specific day or all days")
  .action((day?: string, options?: { watch?: boolean }) => {
    const args = ["test"];
    if (options?.watch) args.push("--watch");

    if (day) {
      const dayNum = parseInt(day);
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
        console.error("Day must be a number between 1 and 25");
        process.exit(1);
      }
      const paddedDay = day.padStart(2, "0");
      const testPath = join("src", `day${paddedDay}`, "test.ts");

      if (!existsSync(testPath)) {
        console.error(`Tests for day ${paddedDay} not found!`);
        process.exit(1);
      }

      console.log(`🧪 Running tests for day ${paddedDay}...\n`);
      args.push(testPath);
    } else {
      console.log("🧪 Running all tests...\n");
    }

    const result = spawnSync("bun", args, { stdio: "inherit" });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  });

// Problem statement commands
program
  .command("problem")
  .argument("<day>", "day number (1-25)")
  .description("View problem statement for a specific day")
  .action(async (day: string) => {
    const dayNum = parseInt(day);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
      console.error("Day must be a number between 1 and 25");
      process.exit(1);
    }

    const paddedDay = day.padStart(2, "0");
    const problemPath = join("src", `day${paddedDay}`, "problem.md");

    if (!existsSync(problemPath)) {
      console.error(`Problem statement for day ${paddedDay} not found!`);
      process.exit(1);
    }

    const content = await readFile(problemPath, "utf-8");
    console.log(content);
  });

program.parse();
