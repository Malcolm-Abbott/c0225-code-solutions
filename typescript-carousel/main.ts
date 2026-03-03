const $iconRow = document.querySelector('.icon-row') as HTMLDivElement;
const $mainRowImage = document.querySelector(
  '.main-row-image'
) as HTMLImageElement;
const $mainRow = document.querySelector('.main-row') as HTMLDivElement;
const $iconRowChildren = $iconRow.children;
const arrayOfIconRowChildren = [...$iconRowChildren] as HTMLElement[];
let currentIndex = 0;
let intervalId = setInterval(() => {
  currentIndex === arrayOfIconRowChildren.length - 1
    ? (currentIndex = 0)
    : currentIndex++;
  setSourceToCarouselImage(currentIndex, $mainRowImage);
  setIconClass(arrayOfIconRowChildren);
}, 1000);

if (!$iconRow) throw new Error('Icon row not found');
if (!$mainRowImage) throw new Error('Main row image not found');
if (!$mainRow) throw new Error('Main row not found');
if (!arrayOfIconRowChildren.length)
  throw new Error('Icon row children not found');

$iconRow.addEventListener('click', handleIconRowClick);
$mainRow.addEventListener('click', handleMainRowClick);

function handleIconRowClick(event: Event): void {
  clearAndSetInterval();
  const eventTarget = event.target as HTMLElement;
  if (!eventTarget.matches('.icon-row i')) return;
  currentIndex = arrayOfIconRowChildren.indexOf(eventTarget);
  setIconClass(arrayOfIconRowChildren);
  setSourceToCarouselImage(currentIndex, $mainRowImage);
}

function setSourceToCarouselImage(index: number, img: HTMLImageElement): void {
  switch (index) {
    case 0:
      img.setAttribute('src', 'images/001.png');
      break;
    case 1:
      img.setAttribute('src', 'images/004.png');
      break;
    case 2:
      img.setAttribute('src', 'images/007.png');
      break;
    case 3:
      img.setAttribute('src', 'images/025.png');
      break;
    case 4:
      img.setAttribute('src', 'images/039.png');
      break;
  }
}

function handleMainRowClick(event: Event): void {
  clearAndSetInterval();
  const eventTarget = event.target as HTMLElement;
  if (!eventTarget.matches('.main-row-icon')) return;
  switch (currentIndex) {
    case 0:
      eventTarget.classList.contains('fa-chevron-left')
        ? (currentIndex = arrayOfIconRowChildren.length - 1)
        : currentIndex++;
      break;
    case arrayOfIconRowChildren.length - 1:
      eventTarget.classList.contains('fa-chevron-left')
        ? currentIndex--
        : (currentIndex = 0);
      break;
    default:
      eventTarget.classList.contains('fa-chevron-left')
        ? currentIndex--
        : currentIndex++;
      break;
  }
  setSourceToCarouselImage(currentIndex, $mainRowImage);
  setIconClass(arrayOfIconRowChildren);
}

function setIconClass(arrayOfIcons: HTMLElement[]): void {
  arrayOfIcons.forEach((icon, index) => {
    switch (index) {
      case currentIndex:
        if (!icon.classList.contains('fa-solid'))
          icon.classList.replace('fa-regular', 'fa-solid');
        break;
      default:
        if (icon.classList.contains('fa-solid'))
          icon.classList.replace('fa-solid', 'fa-regular');
        break;
    }
  });
}

function clearAndSetInterval(): void {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    currentIndex === arrayOfIconRowChildren.length - 1
      ? (currentIndex = 0)
      : currentIndex++;
    setSourceToCarouselImage(currentIndex, $mainRowImage);
    setIconClass(arrayOfIconRowChildren);
  }, 1000);
}
