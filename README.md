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
  │   ├── test.ts      # Tests
  │   └── problem.md   # Problem statement and notes
  └── utils/           # Shared utilities
      ├── input.ts     # Input reading utilities
      └── problem-fetcher.ts  # Problem fetching utilities
```

## CLI Commands

The project includes a CLI tool to help manage solutions. Use `bun aoc` followed by these commands:

### Create New Day

```bash
bun aoc new <day>     # Creates scaffold for a specific day (1-25) and fetches problem
bun aoc new <day> --no-fetch  # Creates scaffold without fetching problem
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

### View Problem Statement

```bash
bun aoc problem <day>  # View problem statement and notes for a specific day
```

## Development Workflow

1. Create a new day's scaffold with auto-fetched problem:
   ```bash
   bun aoc new 1
   ```
   This will:
   - Create the day's directory structure
   - Fetch and format the problem statement
   - Create solution and test templates
   - Extract example inputs

2. Review the auto-generated `problem.md`:
   - Verify the problem statement is correctly formatted
   - Check the extracted example inputs
   - Plan your approach using the provided checklist

3. Add your puzzle input to `src/day01/input.txt`

4. Update the test file with example inputs and expected results

5. Implement your solution in `src/day01/solution.ts`

6. Run tests in watch mode while developing:
   ```bash
   bun aoc test 1 -w
   ```

7. Run your solution:
   ```bash
   bun aoc run 1
   ```

## Problem Statement Format

Each day's `problem.md` includes:
- Auto-fetched problem statement
- Extracted example inputs
- Approach checklist for implementation
- Performance stats tracking

## Note on Problem Fetching

The problem fetcher will automatically:
- Fetch the problem statement from adventofcode.com
- Convert HTML to formatted markdown
- Extract and format example inputs
- Create a structured template for notes and stats

If fetching fails (e.g., due to authentication or network issues), a template will be created instead.
