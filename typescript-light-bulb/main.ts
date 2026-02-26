const $bulb = document.querySelector('.bulb');
const $body = document.querySelector('body');

if (!$bulb) throw new Error('$bulb does not exist');

function handleClick(event: Event): void {
  const eventTarget = event.target as HTMLDivElement;
  eventTarget.classList.toggle('dark');
  $body?.classList.toggle('dark-bg');
}

$bulb?.addEventListener('click', handleClick);
