/**
 * Mostly generated with Copilot, lol
 */
export function convertParenthesesToComponent(str: string): string {
  // Regex patterns for elements to preserve
  const codeBlockRegex = /```[\s\S]*?```|`[^`]*`/g; // Code blocks and inline code
  const jsxRegex = /<[^>]*>[^<]*<\/[^>]*>|<[^>]*\/>/g; // JSX components
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // Markdown links [text](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g; // Markdown images ![alt](url)
  const latexRegex = /\$\$[\s\S]*?\$\$|\$[^\$]*?\$/g; // LaTeX expressions (both inline $ and block $$)

  // Find all special elements and store them with placeholders
  const specialElements: string[] = [];
  
  // Process in order: code blocks, JSX, LaTeX expressions, images, links
  let cleanedString = str;
  
  // Replace code blocks first
  cleanedString = cleanedString.replace(codeBlockRegex, (match) => {
    specialElements.push(match);
    return `__SPECIAL_ELEMENT_${specialElements.length - 1}__`;
  });
  
  // Replace JSX components
  cleanedString = cleanedString.replace(jsxRegex, (match) => {
    specialElements.push(match);
    return `__SPECIAL_ELEMENT_${specialElements.length - 1}__`;
  });
  
  // Replace LaTeX expressions (important to protect math formulas)
  cleanedString = cleanedString.replace(latexRegex, (match) => {
    specialElements.push(match);
    return `__SPECIAL_ELEMENT_${specialElements.length - 1}__`;
  });
  
  // Replace markdown images
  cleanedString = cleanedString.replace(markdownImageRegex, (match) => {
    specialElements.push(match);
    return `__SPECIAL_ELEMENT_${specialElements.length - 1}__`;
  });
  
  // Replace markdown links
  cleanedString = cleanedString.replace(markdownLinkRegex, (match) => {
    specialElements.push(match);
    return `__SPECIAL_ELEMENT_${specialElements.length - 1}__`;
  });

  // Now process regular text parentheses with spaces before and potentially punctuation after
  // Handle both spaces and newlines after parentheses
  const regex = / \(([^)]+)\)([.,;:!?]?)(\s|$|\n)/g;
  cleanedString = cleanedString.replace(regex, (match, content, punctuation, whitespace) => {
    // Preserve the exact type of whitespace (space, newline, or end of string)
    return ` <ToggleParentheses>${content}</ToggleParentheses>${punctuation}${whitespace}`;
  });

  // Restore special elements - using a more robust approach
  for (let i = specialElements.length - 1; i >= 0; i--) {
    const placeholder = `__SPECIAL_ELEMENT_${i}__`;
    const regex = new RegExp(placeholder, 'g');
    cleanedString = cleanedString.replace(regex, specialElements[i]);
  }

  return cleanedString;
}