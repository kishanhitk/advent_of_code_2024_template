import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

async function createDay(day: string) {
  const paddedDay = day.padStart(2, "0");
  const dayPath = join(process.cwd(), "src", `day${paddedDay}`);

  // Create directory
  await mkdir(dayPath, { recursive: true });

  // Create solution.ts
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

const input = readInput(day);
console.log(\`Day \${day} Part 1: \${part1(input)}\`);
console.log(\`Day \${day} Part 2: \${part2(input)}\`);`;

  // Create test.ts
  const testContent = `import { describe, expect, test } from "bun:test";
import { readInput } from '../utils/input';

const day = '${paddedDay}';

describe('Day ${paddedDay}', () => {
    test('part 1', () => {
        const input = readInput(day);
        // TODO: Add test
        expect(true).toBe(true);
    });

    test('part 2', () => {
        const input = readInput(day);
        // TODO: Add test
        expect(true).toBe(true);
    });
});`;

  // Create empty input.txt
  await writeFile(join(dayPath, "solution.ts"), solutionContent);
  await writeFile(join(dayPath, "test.ts"), testContent);
  await writeFile(join(dayPath, "input.txt"), "");

  console.log(`Created scaffold for day ${paddedDay}`);
}

const day = process.argv[2];
if (!day) {
  console.error("Please provide a day number");
  process.exit(1);
}

createDay(day).catch(console.error);
