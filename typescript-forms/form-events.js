'use strict';
function handleFocus(event) {
  console.log('focus event fired');
  const eventTarget = event.target;
  console.log('eventTarget.name:', eventTarget.name);
}
function handleBlur(event) {
  console.log('blur event fired');
  const eventTarget = event.target;
  console.log('eventTarget.name:', eventTarget.name);
}
function handleInput(event) {
  console.log('input event fired');
  const eventTarget = event.target;
  console.log('eventTarget.name:', eventTarget.name);
  console.log('eventTarget.value:', eventTarget.value);
}
const formElements = document.querySelector('form')?.elements;
if (!formElements) throw new Error('formElements does not exist');
for (const ele of formElements) {
  ele.addEventListener('focus', handleFocus);
  ele.addEventListener('blur', handleBlur);
  ele.addEventListener('input', handleInput);
}
