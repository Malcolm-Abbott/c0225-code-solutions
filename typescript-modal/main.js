'use strict';
const $dialog = document.querySelector('dialog');
const $openModal = document.querySelector('.open-modal');
const $dismissModal = document.querySelector('.dismiss-modal');
if (!$dialog) throw new Error('$dialog does not exist');
if (!$openModal) throw new Error('$openModal does not exist');
if (!$dismissModal) throw new Error('$dismissModal does not exist');
$openModal?.addEventListener('click', (event) => {
  if (event) $dialog.showModal();
});
$dismissModal?.addEventListener('click', (event) => {
  if (event) $dialog.close();
});
