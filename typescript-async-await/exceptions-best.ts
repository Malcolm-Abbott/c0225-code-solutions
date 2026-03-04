import { read } from './read.js';

// Keep track of app load time so each log message can be timed.
// Log messages should all be approximately 1 second apart.
const startTime = Date.now();
const elapsed = (): string =>
  `${Math.round((Date.now() - startTime) / 1000)}s -`;

// function throwOnce(): Promise<void> {
//   return read('foo', false)
//     .then((msg) => console.log(elapsed(), 'throwOnce:', msg))
//     .catch((error) => console.log(elapsed(), 'throwOnce Error:', error));
// }
async function throwOnce(): Promise<void> {
  const msg = await read('foo', true);
  console.log(elapsed(), 'throwOnce:', msg);
}

// function throwSeveral(): Promise<void> {
//   return read('foo1', false)
//     .then((msg) => {
//       console.log(elapsed(), 'throwSeveral1:', msg);
//       return read('foo2', false);
//     })
//     .then((msg) => {
//       console.log(elapsed(), 'throwSeveral2:', msg);
//       return read('foo3', false);
//     })
//     .then((msg) => console.log(elapsed(), 'throwSeveral3:', msg))
//     .catch((error) => console.log(elapsed(), 'throwSeveral Error:', error));
// }

async function throwSeveral(): Promise<void> {
  const msg1 = await read('foo1', true);
  console.log(elapsed(), 'throwSeveral1:', msg1);
  const msg2 = await read('foo2', true);
  console.log(elapsed(), 'throwSeveral2:', msg2);
  const msg3 = await read('foo3', true);
  console.log(elapsed(), 'throwSeveral3:', msg3);
}

// function throwChained(): Promise<void> {
//   return read('foo-chain', false)
//     .then((msg1) => {
//       console.log(elapsed(), 'throwChained1:', msg1);
//       return read(msg1, false);
//     })
//     .then((msg2) => {
//       console.log(elapsed(), 'throwChained2:', msg2);
//       return read(msg2, false);
//     })
//     .then((msg3) => console.log(elapsed(), 'throwChained3:', msg3))
//     .catch((error) => console.log(elapsed(), 'throwChained Error:', error));
// }

async function throwChained(): Promise<void> {
  const msg1 = await read('foo-chain', true);
  console.log(elapsed(), 'throwChained1:', msg1);
  const msg2 = await read(msg1, true);
  console.log(elapsed(), 'throwChained2:', msg2);
  const msg3 = await read(msg2, false);
  console.log(elapsed(), 'throwChained3:', msg3);
}

// throwOnce()
//   .then(() => throwSeveral())
//   .then(() => throwChained());
async function throwAll(): Promise<void> {
  try {
    await throwOnce();
    await throwSeveral();
    await throwChained();
  } catch (error) {
    console.log(elapsed(), 'throwAll Error:', error);
  }
}

throwAll();
