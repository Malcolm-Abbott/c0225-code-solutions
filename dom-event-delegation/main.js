'use strict';
const $ul = document.querySelector('.task-list');
if (!$ul) throw new Error('$ul does not exist');
function handleClick(event) {
  const eventTarget = event.target;
  console.log('eventTarget: ', eventTarget);
  console.log('eventTarget.tagName: ', eventTarget.tagName);
  if (eventTarget.tagName === 'BUTTON') eventTarget.closest('li')?.remove();
}
$ul?.addEventListener('click', handleClick);
