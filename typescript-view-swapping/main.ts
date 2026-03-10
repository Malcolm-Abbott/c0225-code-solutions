const $tabContainer = document.querySelector('.tab-container');

if (!$tabContainer) throw new Error('$tabContainer does not exist');

function handleClick(event: Event): void {
  const eventTarget = event.target as HTMLDivElement;

  if (!eventTarget.matches('.tab')) return;

  const currentTabView = eventTarget.dataset.view;
  const $tabs = document.querySelectorAll<HTMLDivElement>('.tab');
  let tabView;

  for (const $tab of $tabs) {
    tabView = $tab.dataset.view;
    if (tabView !== currentTabView && $tab.classList.contains('active'))
      $tab.classList.remove('active');
    if (tabView === currentTabView && !$tab.classList.contains('active'))
      $tab.classList.add('active');
  }

  const $views = document.querySelectorAll<HTMLDivElement>('.view');
  let view;

  for (const $view of $views) {
    view = $view.dataset.view;
    if (view !== currentTabView && !$view.classList.contains('hidden'))
      $view.classList.add('hidden');
    if (view === currentTabView && $view.classList.contains('hidden'))
      $view.classList.remove('hidden');
  }
}

$tabContainer?.addEventListener('click', handleClick);
