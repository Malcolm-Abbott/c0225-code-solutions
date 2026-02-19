'use strict';
const orderHistory = [
  {
    productName: 'JavaScript for impatient programmers',
    productType: 'book',
    productPrice: 31.55,
    orderNumber: '114-3941689-8772232',
    orderTotal: 34.0,
    orderPlaced: 'August 4, 2020',
    orderDelivered: 'August 8, 2020',
    author: 'Rauschmayer, Dr. Axel',
  },
  {
    productName: 'The Timeless Way of Building',
    productType: 'book',
    productPrice: 41.33,
    orderNumber: '113-9984268-1280257',
    orderTotal: 44.53,
    orderPlaced: 'July 19, 2020',
    orderDelivered: 'July 20, 2020',
    author: 'Alexander, Christopher',
  },
  {
    productName: 'Gamecube Controller Adapter',
    productType: 'electronic',
    productPrice: 15.98,
    orderNumber: '114-2875557-9059409',
    orderTotal: 17.22,
    orderPlaced: 'July 4, 2020',
    orderDelivered: 'July 7, 2020',
    manufacturer: 'Nintendo',
  },
  {
    productName:
      'GameCube Controller - Super Smash Bros. Edition (Nintendo Switch)',
    productType: 'electronics',
    productPrice: 94.95,
    orderNumber: '113-2883177-2648248',
    orderTotal: 138.93,
    orderPlaced: 'July 3, 2020',
    orderDelivered: 'July 5, 2020',
    manufacturer: 'nintendo',
  },
  {
    productName: 'The Art of Sql',
    productType: 'book',
    productPrice: 33.99,
    orderNumber: '113-2883177-2648248',
    orderTotal: 138.93,
    orderPlaced: 'July 3, 2020',
    orderDelivered: 'July 5, 2020',
    author: 'Faroult, Stephane',
  },
];
console.log('orderHistory: ', orderHistory);
function logOrderHistoryTotal(iterable) {
  const orderNumbersArr = [];
  let total = 0;
  iterable.forEach((order) => {
    if (!orderNumbersArr.includes(order.orderNumber)) total += order.orderTotal;
    if (!orderNumbersArr.includes(order.orderNumber))
      orderNumbersArr.push(order.orderNumber);
  });
  const totalInDollars = `${total}`;
  console.log('orderNumbersArr: ', orderNumbersArr);
  console.log(`totalInDollars: $${totalInDollars}`);
}
logOrderHistoryTotal(orderHistory);
