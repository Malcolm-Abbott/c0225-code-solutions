const $tabContainer = document.querySelector('.tab-container');

function handleClick(event: Event): void {
  const eventTarget = event.target as HTMLDivElement;
  const currentTabView = eventTarget.dataset.view;
  const $tabs = document.querySelectorAll<HTMLDivElement>('.tab');
  let tabView;

  for (const $tab of $tabs) {
    tabView = $tab.dataset.view;
    if (tabView !== currentTabView) $tab.className = 'tab';
    if (tabView === currentTabView) $tab.className = 'tab active';
  }
}

$tabContainer?.addEventListener('click', handleClick);
