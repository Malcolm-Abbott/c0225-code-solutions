import { takeAChance } from './take-a-chance.js';

takeAChance('Alexa')
  .then((message) => console.log(message))
  .catch((error) => console.error(error));
