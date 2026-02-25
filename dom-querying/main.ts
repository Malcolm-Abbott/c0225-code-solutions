const $h1 = document.querySelector('h1');
console.log($h1);
console.dir($h1);

const $explanation = document.querySelector('#explanation');
console.log($explanation);
console.dir($explanation);

const $hint = document.querySelector('.hint');
console.log($hint);
console.dir($hint);

const $pNodeList = document.querySelectorAll('p');
console.log($pNodeList);

$pNodeList.forEach((node) => console.log(node));
