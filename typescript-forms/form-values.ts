interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  message: HTMLTextAreaElement;
}

const $contactForm = document.querySelector('#contact-form') as HTMLFormElement;

function handleSubmit(event: Event): void {
  event.preventDefault();
  const $formElements = $contactForm.elements as FormElements;

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
