/* exported addSuffixToAll */
function addSuffixToAll(words: string[], suffix: string): string[] {
  const suffixed = [];

  for (const word of words) {
    suffixed.push(word + suffix);
  }
  return suffixed;
}
