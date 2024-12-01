# Advent of Code Template

A TypeScript template for [Advent of Code](https://adventofcode.com) using Bun. Features include:
- Automated problem fetching and formatting
- TypeScript with full type safety
- Fast test execution with Bun
- Auto-reloading development environment
- Performance metrics (execution time and memory usage)
- Flexible testing with optional expected outputs
- Utility functions for common operations
- Organized project structure

## Using This Template

Click "Use this template" on GitHub or clone the repository:
   ```bash
   git clone https://github.com/kishanhitk/advent_of_code_2024_template.git aoc2024
   cd aoc2024
   ```

## Quick Start

```bash
# Install dependencies
bun install

# Create a new day
bun aoc new 1

# Run solution with auto-reload
bun aoc run 1 -w

# Run tests with auto-reload
bun aoc test 1 -w
```

## Project Structure

```
src/
  ├── day01/
  │   ├── input.txt         # Puzzle input
  │   ├── solution.ts       # Solution implementation
  │   ├── solution.test.ts  # Tests for the solution
  │   └── problem.md        # Problem statement and notes
  └── utils/                # Shared utilities
      ├── input.ts          # Input reading utilities
      └── problem-fetcher.ts # Problem fetching utilities
```

## CLI Commands

The project includes a powerful CLI tool. Use `bun aoc` followed by these commands:

### Create New Day

```bash
# Create new day with auto-fetched problem
bun aoc new <day>

# Create without fetching problem
bun aoc new <day> --no-fetch
```

This will:
- Create the day's directory structure
- Fetch and format the problem statement
- Create solution and test templates
- Extract example inputs
- Provide instructions for getting your input

### Run Solutions

```bash
# Run specific day
bun aoc run <day>

# Run with auto-reload (watch mode)
bun aoc run <day> -w

# Run all solutions
bun aoc run

# Run all in watch mode
bun aoc run -w
```

### Run Tests

```bash
# Run specific day's tests
bun aoc test <day>

# Run with auto-reload
bun aoc test <day> -w

# Run all tests
bun aoc test

# Run all tests in watch mode
bun aoc test -w
```

### View Problem

```bash
# View problem statement
bun aoc problem <day>
```

## Development Workflow

1. Create New Day
   ```bash
   bun aoc new 1
   ```

2. Get Your Input
   - Follow the provided link to get your input
   - Copy and paste into `src/dayXX/input.txt`
   - Each user gets unique input data!

3. Review Problem
   - Check `problem.md` for:
     - Problem description
     - Example inputs/outputs
     - Your approach checklist

4. Development Loop
   ```bash
   # Terminal 1: Watch solution
   bun aoc run 1 -w

   # Terminal 2: Watch tests
   bun aoc test 1 -w
   ```

5. Implement Solution
   - Start with example inputs in tests
   - Implement part 1
   - Run against your input
   - Repeat for part 2

## Solution Structure

### solution.ts
```typescript
import { readInput, readLines } from '../utils/input';

const day = '01';

function part1(input: string): number {
    // Implementation
}

function part2(input: string): number {
    // Implementation
}

if (import.meta.main) {
    const input = readInput(day);
    
    console.log(`Day ${day}:`);
    
    const start1 = performance.now();
    const result1 = part1(input);
    const end1 = performance.now();
    console.log(`Part 1: ${result1}`);
    console.log(`Time: ${(end1 - start1).toFixed(2)}ms`);
    console.log(`Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\n`);
    
    const start2 = performance.now();
    const result2 = part2(input);
    const end2 = performance.now();
    console.log(`Part 2: ${result2}`);
    console.log(`Time: ${(end2 - start2).toFixed(2)}ms`);
    console.log(`Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
}

export { part1, part2 };
```

### solution.test.ts
```typescript
import { describe, expect, test } from "bun:test";
import { part1, part2 } from './solution';

describe('Day 01', () => {
    const example = `example input here`;

    test('part 1 - example', () => {
        const result = part1(example);
        console.log('Example result:', result);
        // Uncomment and update if you have expected output:
        // expect(result).toBe(expected);
    });

    // More tests...
});
```

## Utility Functions

### Input Reading
```typescript
import { readInput, readLines, readNumbers } from '../utils/input';

// Read entire input as string
const input = readInput(day);

// Read input as lines
const lines = readLines(day);

// Read input as numbers
const numbers = readNumbers(day);
```

### Input Validation
```typescript
import { isNumeric, containsOnly } from '../utils/input';

// Check if string contains only numbers
isNumeric("123");  // true

// Check if string contains only allowed characters
containsOnly("abc123", "abc123");  // true
```

## Best Practices

1. Testing First
   - Start with example inputs
   - Write tests before implementation
   - Use watch mode for quick feedback
   - Add expected outputs in tests when available

2. Input Handling
   - Always trim input
   - Validate input format
   - Handle edge cases

3. Performance
   - Automatic tracking of execution time and memory usage
   - Results show both time and memory metrics
   - Optimize after getting correct answer
   - Consider memory usage for large inputs

4. Code Organization
   - Keep utility functions in `utils/`
   - Use TypeScript types
   - Comment complex logic

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
