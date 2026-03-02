const $countdownDisplay = document.querySelector(
  '.countdown-display'
) as HTMLHeadingElement;

if (!$countdownDisplay) throw new Error('Countdown display element not found');

let counter = 4;

const intervalId = setInterval(function () {
  console.log('counter:', counter);
  $countdownDisplay.textContent = counter.toString();
  counter--;
  if (counter < 0) {
    $countdownDisplay.textContent = 'Blast off!';
    clearInterval(intervalId);
  }
}, 1000);
