function handleFocus(event: Event): void {
  console.log('focus event fired');
  const eventTarget = event.target as HTMLInputElement | HTMLTextAreaElement;
  console.log('eventTarget.name:', eventTarget.name);
}

function handleBlur(event: Event): void {
  console.log('blur event fired');
  const eventTarget = event.target as HTMLInputElement | HTMLTextAreaElement;
  console.log('eventTarget.name:', eventTarget.name);
}

function handleInput(event: Event): void {
  console.log('input event fired');
  const eventTarget = event.target as HTMLInputElement | HTMLTextAreaElement;
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
