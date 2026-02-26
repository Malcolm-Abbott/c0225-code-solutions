'use strict';
const $hotButton = document.querySelector('.hot-button');
const $clickCount = document.querySelector('.click-count');
if (!$hotButton) throw new Error('$hotButton does not exist');
let clicks = 0;
function handleClick(event) {
  if (!$clickCount || !$hotButton)
    throw new Error('The $hotButton or $clickCount query failed');
  $clickCount.textContent = `Clicks: ${++clicks}`;
  if (event.target !== $hotButton) return;
  switch (clicks) {
    case 4:
      $hotButton.classList.replace('cold', 'cool');
      break;
    case 7:
      $hotButton.classList.replace('cool', 'tepid');
      break;
    case 10:
      $hotButton.classList.replace('tepid', 'warm');
      break;
    case 13:
      $hotButton.classList.replace('warm', 'hot');
      break;
    case 16:
      $hotButton.classList.replace('hot', 'nuclear');
      break;
    default:
      break;
  }
}
$hotButton?.addEventListener('click', handleClick);
