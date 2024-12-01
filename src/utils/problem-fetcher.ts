import { readFileSync } from "fs";
import { join } from "path";

interface ProblemData {
  title: string;
  description: string;
  examples: string[];
}

export async function fetchProblem(
  day: number,
  year = 2024
): Promise<ProblemData> {
  const url = `https://adventofcode.com/${year}/day/${day}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch problem: ${response.statusText}`);
    }

    const html = await response.text();
    return parseProblemHtml(html, day);
  } catch (error) {
    console.error("Error fetching problem:", error);
    throw error;
  }
}

function parseProblemHtml(html: string, day: number): ProblemData {
  // Extract title
  const titleMatch = html.match(/<h2>--- Day \d+: (.*?) ---<\/h2>/);
  const title = titleMatch ? titleMatch[1] : "Unknown Title";

  // Extract main article content
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/g);
  if (!articleMatch) {
    throw new Error("Could not find problem description");
  }

  // Clean up HTML and convert to markdown
  const description = articleMatch
    .map((article) => {
      return article
        .replace(/<h2>.*?<\/h2>/, "") // Remove h2 headers
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1```") // Convert code blocks
        .replace(/<em>(.*?)<\/em>/g, "*$1*") // Convert emphasis
        .replace(/<code><em>(.*?)<\/em><\/code>/g, "`*$1*`") // Handle code with emphasis
        .replace(/<code>(.*?)<\/code>/g, "`$1`") // Convert inline code
        .replace(/<p>([\s\S]*?)<\/p>/g, "$1\n\n") // Handle paragraphs
        .replace(/<ul>([\s\S]*?)<\/ul>/g, "$1\n") // Handle lists
        .replace(/<li>([\s\S]*?)<\/li>/g, "- $1\n") // Handle list items
        .replace(/<article[^>]*>|<\/article>/g, "") // Remove article tags
        .replace(/\n{3,}/g, "\n\n") // Remove extra newlines
        .trim();
    })
    .join("\n\n");

  // Extract example inputs
  const examples: string[] = [];
  const exampleMatches = html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/g);
  if (exampleMatches) {
    examples.push(
      ...exampleMatches.map((match) =>
        match
          .replace(/<pre><code>/, "")
          .replace(/<\/code><\/pre>/, "")
          .trim()
      )
    );
  }

  return {
    title,
    description,
    examples,
  };
}

export function generateProblemMd(data: ProblemData): string {
  return `# ${data.title}

${data.description}

## Notes

### Example Inputs
${data.examples
  .map(
    (example, i) => `
Example ${i + 1}:
\`\`\`
${example}
\`\`\`
`
  )
  .join("\n")}

## Approach

### Part 1
- [ ] Parse input
- [ ] Process data
- [ ] Calculate result

### Part 2
- [ ] Extend part 1 solution
- [ ] Handle new requirements
- [ ] Calculate result

## Solution Stats

### Part 1
- Time: XX ms
- Memory: XX MB

### Part 2
- Time: XX ms
- Memory: XX MB
`;
}
