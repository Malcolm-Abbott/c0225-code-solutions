'use strict';
/* exported addSuffixToAll */
function addSuffixToAll(words, suffix) {
  const suffixed = [];
  for (const word of words) {
    suffixed.push(word + suffix);
  }
  return suffixed;
}
