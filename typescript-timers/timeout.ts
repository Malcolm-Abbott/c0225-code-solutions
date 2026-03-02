const $message = document.querySelector('.message') as HTMLHeadingElement;

if (!$message) throw new Error('Message element not found');

setTimeout(function () {
  $message.textContent = 'Hello There';
}, 2000);
