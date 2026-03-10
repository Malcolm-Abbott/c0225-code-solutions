/* exported getStudentNames */
function getStudentNames(students: Record<string, unknown>[]): unknown[] {
  // const names: unknown[] = students.map((student) => student.name);
  const names: unknown[] = [];
  for (const student of students) {
    names.push(student.name);
  }
  return names;
}
