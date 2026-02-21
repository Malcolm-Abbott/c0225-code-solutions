'use strict';
/* exported getStudentNames */
function getStudentNames(students) {
  // const names: unknown[] = students.map((student) => student.name);
  const names = [];
  for (const student of students) {
    names.push(student.name);
  }
  return names;
}
