/* exported getPropertyValue */
// const getPropertyValue = (object: Person, key: string): string =>
//   object[key as keyof typeof object];
function getPropertyValue(object: Person, key: string): string {
  return object[key as keyof typeof object];
}
