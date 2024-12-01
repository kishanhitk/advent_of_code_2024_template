# Advent of Code 2024

Solutions for [Advent of Code 2024](https://adventofcode.com/2024) implemented in TypeScript using Bun.

## Setup

```bash
# Install dependencies
bun install
```

## Project Structure

```
src/
  ├── day01/
  │   ├── input.txt    # Puzzle input
  │   ├── solution.ts  # Solution implementation
  │   └── test.ts      # Tests
  └── utils/           # Shared utilities
```

## CLI Commands

The project includes a CLI tool to help manage solutions. Use `bun aoc` followed by these commands:

### Create New Day

```bash
bun aoc new <day>    # Creates scaffold for a specific day (1-25)
```

### Run Solutions

```bash
bun aoc run          # Run all implemented solutions
bun aoc run <day>    # Run solution for a specific day
```

### Run Tests

```bash
bun aoc test         # Run all tests
bun aoc test <day>   # Run tests for a specific day
bun aoc test -w      # Run all tests in watch mode
bun aoc test 1 -w    # Run day 1 tests in watch mode
```

## Development Workflow

1. Create a new day's scaffold:
   ```bash
   bun aoc new 1
   ```

2. Add your puzzle input to `src/day01/input.txt`

3. Add the example input and expected results in `src/day01/test.ts`

4. Implement your solution in `src/day01/solution.ts`

5. Run tests in watch mode while developing:
   ```bash
   bun aoc test 1 -w
   ```

6. Run your solution:
   ```bash
   bun aoc run 1
   ```
