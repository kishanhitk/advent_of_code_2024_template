#!/usr/bin/env bun
import { Command } from "commander";
import { mkdir, writeFile, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";
import { watch } from "fs/promises";
import { fetchProblem, generateProblemMd } from "./src/utils/problem-fetcher";
import { yellow, green, red } from "picocolors";

const program = new Command();

program
  .name("aoc")
  .description("CLI tool for Advent of Code 2024")
  .version("1.0.0");

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
Each user gets different input data, so make sure to use your own!`;
}

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
    
    console.log(\`Day \${day}:\`);
    
    const start1 = performance.now();
    const result1 = part1(input);
    const end1 = performance.now();
    console.log(\`Part 1: \${result1}\`);
    console.log(\`Time: \${(end1 - start1).toFixed(2)}ms\`);
    console.log(\`Memory: \${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\n\`);
    
    const start2 = performance.now();
    const result2 = part2(input);
    const end2 = performance.now();
    console.log(\`Part 2: \${result2}\`);
    console.log(\`Time: \${(end2 - start2).toFixed(2)}ms\`);
    console.log(\`Memory: \${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\`);
}

export { part1, part2 };`;

    const testContent = `import { describe, expect, test } from "bun:test";
import { readInput } from '../utils/input';
import { part1, part2 } from './solution';

const day = '${paddedDay}';

describe('Day ${paddedDay}', () => {
    const example = \`EXAMPLE_INPUT_HERE\`;  // Replace with example input

    test('part 1 - example', () => {
        const result = part1(example);
        console.log('Example result:', result);
        // Uncomment and update if you have expected output:
        // expect(result).toBe(0);
    });

    test('part 1 - input', () => {
        const input = readInput(day);
        const result = part1(input);
        console.log('Your input result:', result);
    });

    test('part 2 - example', () => {
        const result = part2(example);
        console.log('Example result:', result);
        // Uncomment and update if you have expected output:
        // expect(result).toBe(0);
    });

    test('part 2 - input', () => {
        const input = readInput(day);
        const result = part2(input);
        console.log('Your input result:', result);
    });
});`;

    // Create files
    await writeFile(join(dayPath, "solution.ts"), solutionContent);
    await writeFile(join(dayPath, "solution.test.ts"), testContent);
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

    console.log("\n✨ Day scaffold created successfully!\n");

    // Show input instructions prominently
    console.log("📝 Next steps:");
    console.log(getInputInstructions(day));
    console.log("\n🚀 Available commands:");
    console.log(green("→ Run solution:"));
    console.log(`  bun aoc run ${dayNum}`);
    console.log(`  bun aoc run ${dayNum} -w  (watch mode)`);
    console.log(green("\n→ Run tests:"));
    console.log(`  bun aoc test ${dayNum}`);
    console.log(`  bun aoc test ${dayNum} -w  (watch mode)`);
    console.log(green("\n→ View problem:"));
    console.log(`  bun aoc problem ${dayNum}`);
  });

// Helper function to check if a file should trigger a reload
function shouldReload(filename: string | null): boolean {
  if (!filename) return false;
  return filename.endsWith(".ts") || filename.endsWith(".txt");
}

// Run solution command
program
  .command("run")
  .argument("[day]", "day number (1-25)")
  .option("-w, --watch", "watch mode")
  .description("Run solution for a specific day or all days")
  .action(async (day?: string, options?: { watch?: boolean }) => {
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

      const runSolution = () => {
        console.clear();
        console.log(`🎄 Running solution for day ${paddedDay}...\n`);
        const result = spawnSync("bun", ["run", solutionPath], {
          stdio: "inherit",
          env: { ...process.env, FORCE_COLOR: "1" },
        });
        if (result.status !== 0) {
          console.error(`\n❌ Solution failed with exit code ${result.status}`);
        }
      };

      if (options?.watch) {
        console.log(
          `👀 ${yellow("Watching")} for changes in day ${paddedDay}...`
        );
        console.log(
          `💡 ${green("Tip:")} Save any file to re-run the solution\n`
        );

        // Initial run
        runSolution();

        // Watch for changes
        const dayPath = join("src", `day${paddedDay}`);
        try {
          const watcher = watch(dayPath, { recursive: true });
          for await (const event of watcher) {
            if (shouldReload(event.filename)) {
              runSolution();
            }
          }
        } catch (error) {
          console.error("Watch mode error:", error);
          process.exit(1);
        }
      } else {
        runSolution();
      }
    } else {
      // Run all implemented solutions
      console.log("🎄 Running all implemented solutions...\n");
      let foundAny = false;

      for (let i = 1; i <= 25; i++) {
        const paddedDay = i.toString().padStart(2, "0");
        const solutionPath = join("src", `day${paddedDay}`, "solution.ts");

        if (existsSync(solutionPath)) {
          foundAny = true;
          console.log(`\n📅 Day ${paddedDay}:`);
          const result = spawnSync("bun", ["run", solutionPath], {
            stdio: "inherit",
            env: { ...process.env, FORCE_COLOR: "1" },
          });
          if (result.status !== 0) {
            process.exit(result.status ?? 1);
          }
        }
      }

      if (!foundAny) {
        console.log("No solutions found to run!");
        process.exit(1);
      }
    }
  });

// Test command
program
  .command("test")
  .argument("[day]", "day number (1-25)")
  .option("-w, --watch", "watch mode")
  .description("Run tests for a specific day or all days")
  .action(async (day?: string, options?: { watch?: boolean }) => {
    const runTests = (testPath?: string) => {
      const args = ["test"];
      if (options?.watch) args.push("--watch");
      if (testPath) args.push(testPath);

      console.clear();
      console.log("🧪 Running tests...\n");

      const result = spawnSync("bun", args, {
        stdio: "inherit",
        env: { ...process.env, FORCE_COLOR: "1" },
      });

      if (result.status !== 0) {
        console.error(`\n❌ Tests failed with exit code ${result.status}`);
      }
    };

    if (day) {
      const dayNum = parseInt(day);
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
        console.error("Day must be a number between 1 and 25");
        process.exit(1);
      }
      const paddedDay = day.padStart(2, "0");
      const testPath = join("src", `day${paddedDay}`, "solution.test.ts");

      if (!existsSync(testPath)) {
        console.error(`Tests for day ${paddedDay} not found!`);
        process.exit(1);
      }

      if (options?.watch) {
        console.log(
          `👀 ${yellow("Watching")} for changes in day ${paddedDay}...`
        );
        console.log(`💡 ${green("Tip:")} Save any file to re-run the tests\n`);

        // Initial run
        runTests(testPath);

        // Watch for changes
        const dayPath = join("src", `day${paddedDay}`);
        try {
          const watcher = watch(dayPath, { recursive: true });
          for await (const event of watcher) {
            if (shouldReload(event.filename)) {
              runTests(testPath);
            }
          }
        } catch (error) {
          console.error("Watch mode error:", error);
          process.exit(1);
        }
      } else {
        runTests(testPath);
      }
    } else {
      if (options?.watch) {
        console.log(`👀 ${yellow("Watching")} for changes in all tests...`);
        console.log(`💡 ${green("Tip:")} Save any file to re-run all tests\n`);

        // Initial run
        runTests();

        // Watch for changes in src directory
        try {
          const watcher = watch("src", { recursive: true });
          for await (const event of watcher) {
            if (shouldReload(event.filename)) {
              runTests();
            }
          }
        } catch (error) {
          console.error("Watch mode error:", error);
          process.exit(1);
        }
      } else {
        runTests();
      }
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
