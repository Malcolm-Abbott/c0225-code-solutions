const $dialog = document.querySelector('dialog') as HTMLDialogElement;
const $openModal = document.querySelector('.open-modal') as HTMLButtonElement;
const $dismissModal = document.querySelector(
  '.dismiss-modal'
) as HTMLButtonElement;

if (!$dialog) throw new Error('$dialog does not exist');
if (!$openModal) throw new Error('$openModal does not exist');
if (!$dismissModal) throw new Error('$dismissModal does not exist');

$openModal?.addEventListener('click', (event: Event): void => {
  if (event) $dialog.showModal();
});

$dismissModal?.addEventListener('click', (event: Event): void => {
  if (event) $dialog.close();
});
