'use strict';
const $message = document.querySelector('.message');
if (!$message) throw new Error('Message element not found');
setTimeout(function () {
  $message.textContent = 'Hello There';
}, 2000);
