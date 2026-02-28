'use strict';
const $tabContainer = document.querySelector('.tab-container');
function handleClick(event) {
  const eventTarget = event.target;
  const currentTabView = eventTarget.dataset.view;
  const $tabs = document.querySelectorAll('.tab');
  let tabView;
  for (const $tab of $tabs) {
    tabView = $tab.dataset.view;
    if (tabView !== currentTabView) $tab.className = 'tab';
    if (tabView === currentTabView) $tab.className = 'tab active';
  }
}
$tabContainer?.addEventListener('click', handleClick);
