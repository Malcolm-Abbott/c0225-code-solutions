const $ul = document.querySelector('.task-list');

if (!$ul) throw new Error('$ul does not exist');

function handleClick(event: Event): void {
  const eventTarget = event.target as HTMLElement;
  console.log('eventTarget: ', eventTarget);
  console.log('eventTarget.tagName: ', eventTarget.tagName);

  if (eventTarget.tagName === 'BUTTON') eventTarget.closest('li')?.remove();
}

$ul?.addEventListener('click', handleClick);
