/* exported countdown */
function countdown(num: number): number[] {
  const numArr: number[] = [];
  while (num >= 0) {
    numArr.push(num);
    num--;
  }
  return numArr;
}
