/* exported filterOutNulls */
function filterOutNulls(values: unknown[]): unknown[] {
  // const noNulls: unknown[] = values.filter((value) => value !== null);
  const noNulls: unknown[] = [];

  for (const value of values) {
    if (value !== null) noNulls.push(value);
  }

  return noNulls;
}
