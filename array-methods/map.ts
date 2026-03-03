const prices = [42.42, 10, 28.2234, 3.2, 5, 12];

const pricesInDollars = prices.map((price) => `$${price.toFixed(2)}`);
console.log(pricesInDollars);
