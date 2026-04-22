export function jiraToDiscord(input: string): string {
  let output = input;

  // Headings (h1. → **bold + newline**)
  output = output.replace(/^h([1-6])\.\s*(.*)$/gm, (_, level, text) => {
    return `**${text.trim()}**\n`;
  });

  // Horizontal rule (---- → ---)
  output = output.replace(/^-{4,}$/gm, "---");

  // Bold (*text* → **text**)
  output = output.replace(/\*(.*?)\*/g, "**$1**");

  // Code blocks {code[:lang]} ... {code}
  output = output.replace(
    /\{code(?::([a-zA-Z0-9#+-]+))?\}([\s\S]*?)\{code\}/g,
    (_, lang, code) => {
      const language = lang || "";
      return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
    },
  );

  // Inline code {{text}} → `text`
  output = output.replace(/\{\{(.*?)\}\}/g, "`$1`");

  // Images !file.png|params! → just show filename or link-style
  output = output.replace(/!(.+?)(\|.*?)?!/g, (_, file) => {
    return `[📎 ${file}]`;
  });

  // Links [text|url] → [text](url)
  output = output.replace(/\[(.+?)\|(.+?)\]/g, "[$1]($2)");

  // Remove excessive empty lines (Discord collapses anyway)
  output = output.replace(/\n{3,}/g, "\n\n");

  output = output
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");

  return output;
}
