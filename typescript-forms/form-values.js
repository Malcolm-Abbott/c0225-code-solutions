'use strict';
const $contactForm = document.querySelector('#contact-form');
function handleSubmit(event) {
  event.preventDefault();
  const $formElements = $contactForm.elements;
  if (!$formElements) throw new Error('$formElements does not exist');
  const values = {
    name: $formElements.name.value,
    email: $formElements.email.value,
    message: $formElements.message.value,
  };
  console.log('values:', values);
  $contactForm.reset();
}
$contactForm.addEventListener('submit', handleSubmit);
