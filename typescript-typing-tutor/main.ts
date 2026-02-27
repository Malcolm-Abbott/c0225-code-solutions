const $nodeList = document.querySelectorAll('span');
let nodeIndex = 0;

if (!$nodeList) throw new Error('$nodeList does not exist');

function keydownHandler(event: KeyboardEvent): void {
  if (nodeIndex >= $nodeList.length) return;
  let nextNodeIndex = nodeIndex + 1;
  const currentChar = $nodeList[nodeIndex].textContent;
  const $currentNode = $nodeList[nodeIndex];
  const $nextNode = $nodeList[nextNodeIndex];

  switch (true) {
    case !(event.key === currentChar) &&
      !$currentNode?.classList.contains('incorrect'):
      $currentNode.classList.add('incorrect');
      break;

    case event.key === currentChar &&
      $currentNode.classList.contains('incorrect'):
      $currentNode.classList.replace('incorrect', 'completed');
      $currentNode.classList.remove('current');
      nodeIndex++;
      nextNodeIndex++;
      if ($nextNode) $nextNode.classList.add('current');
      break;

    case event.key === currentChar &&
      !$currentNode.classList.contains('incorrect'):
      $currentNode.classList.replace('current', 'completed');
      nodeIndex++;
      nextNodeIndex++;
      if ($nextNode) $nextNode.classList.add('current');
      break;
  }
}

window?.addEventListener('keydown', keydownHandler);
