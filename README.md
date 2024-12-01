# Advent of Code 2024

Solutions for [Advent of Code 2024](https://adventofcode.com/2024) implemented in TypeScript using Bun.

## Project Structure

```
src/
  ├── day01/
  │   ├── input.txt    # Puzzle input
  │   ├── solution.ts  # Solution implementation
  │   └── test.ts      # Tests
  └── utils/           # Shared utilities
scripts/
  └── new-day.ts       # Script to scaffold new day
```

## Commands

- `bun run src/dayXX/solution.ts` - Run a specific day's solution
- `bun test` - Run all tests
- `bun run new-day XX` - Create scaffold for day XX

## Development

1. Create a new day's scaffold:
   ```bash
   bun run new-day 01
   ```

2. Add your puzzle input to `src/dayXX/input.txt`

3. Implement your solution in `src/dayXX/solution.ts`

4. Run your solution:
   ```bash
   bun run src/day01/solution.ts
   ```

## Testing

Each day's solution includes a test file. Run all tests with:

```bash
bun test
```
