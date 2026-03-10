/* exported filterOutStrings */
function filterOutStrings(values: unknown[]): unknown[] {
  // const noStrings: unknown[] = values.filter(
  //   (value) => typeof value !== 'string'
  // );
  const noStrings: unknown[] = [];

  for (const value of values) {
    if (typeof value !== 'string') noStrings.push(value);
  }
  return noStrings;
}
