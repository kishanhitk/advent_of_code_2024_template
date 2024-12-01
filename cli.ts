#!/usr/bin/env bun
import { Command } from "commander";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";

const program = new Command();

program
  .name("aoc")
  .description("CLI tool for Advent of Code 2024")
  .version("1.0.0");

// Create new day command
program
  .command("new")
  .argument("<day>", "day number (1-25)")
  .description("Create a new day scaffold")
  .action(async (day: string) => {
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

    await writeFile(join(dayPath, "solution.ts"), solutionContent);
    await writeFile(join(dayPath, "test.ts"), testContent);
    await writeFile(join(dayPath, "input.txt"), "");

    console.log(`✨ Created scaffold for day ${paddedDay}`);
    console.log(`📝 Add your puzzle input to src/day${paddedDay}/input.txt`);
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

program.parse();
