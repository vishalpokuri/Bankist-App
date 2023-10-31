'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//
//Functions
const calcDisplayBalance = function (acc) {
  const blance = acc.movements.reduce((acc, item) => acc + item);
  labelBalance.textContent = `${blance.toFixed(2)} €`;
  acc.balance = blance;
};
let currentAccount;
const calcdisplayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${Number(move).toFixed(2)}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const Inflow = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${Inflow.toFixed(2)}€`;

  const Outflow = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  );
  labelSumOut.textContent = `${Outflow.toFixed(2)}€`;

  const Interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${Interest.toFixed(2)}€`;
};

const user = 'Steven Thomas Williams'; //stw
const username = user
  .toLowerCase()
  .split(' ')
  .map(word => word[0])
  .join('');

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);
//
//update UI
const updateUI = function (acc) {
  //display movements
  calcdisplayMovements(acc);
  //display balance
  calcDisplaySummary(acc);
  //display summary
  calcDisplayBalance(acc);
};
//Fake login always
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
//
//Adding times
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hours = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

//
//button login

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    document.querySelector('.app').style.opacity = 100;
    updateUI(currentAccount);
  } else if (currentAccount.pin !== Number(inputLoginPin.value)) {
    alert('Credentials mismatch, please try again with correct credentials');
  } else {
    alert("Account doesn't exist");
  }
  console.log(currentAccount);
});
//
//loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const inputAmt = Number(inputLoanAmount.value).toFixed(2);
  if (
    inputAmt > 0 &&
    currentAccount.movements.some(value => value > inputAmt / 10)
  ) {
    currentAccount.movements.push(inputAmt);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    alert(
      'Loan cannot be requested, please make a deposit which is atleast 0.1 times the loan amount'
    );
  }
});
//
//transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const receiverAmt = Number(inputTransferAmount.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    receiverAmt > 0 &&
    receiver &&
    currentAccount.balance > receiverAmt &&
    receiver?.username !== currentAccount.username
  ) {
    inputTransferAmount.blur();
    receiver.movements.push(receiverAmt);
    currentAccount.movements.push(-receiverAmt);
    updateUI(currentAccount);
    console.log('Transfer valid ');
  } else {
    alert('Invalid operation');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const inputusername = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  const inputpass = Number(inputClosePin.value);
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  if (currentAccount === inputusername && inputusername?.pin === inputpass) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    document.querySelector('.app').style.opacity = 0;
    console.log(inputusername);
    accounts.splice(index, 1);
    console.log(accounts);
    alert('Account deleted successfully, sorry to see you go!!😔🥺');
  }
});
//
//button sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  calcdisplayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//////////////////////////  Lecture practice   ///////////////////////
// console.log(accounts);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits1 = movements.map(function (mov) {
//   return mov > 0;
// });
// const deposits2 = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits1);
// console.log(deposits2);
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 1000);
// console.log(balance);
// const maxMovement = movements.reduce((acc, mov) => (acc > mov ? acc : mov));
// console.log(maxMovement);
// const calcAvgHumanAge = function (arr) {
//   const humanyears = arr.map(item => (item <= 2 ? 2 * item : 16 + item * 4));
//   const exclude = humanyears.filter(item => item >= 18);
//   const avgadultdogsage = exclude.reduce((acc, item) => acc + item);
//   console.log(humanyears);
//   console.log(exclude);
//   console.log(avgadultdogsage / exclude.length);
// };

// calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const allmovements = accounts.map(acc => acc.movements);
// console.log(allmovements.flat());
// const overallvalue = allmovements.flat().reduce((acc, val) => acc + val);
// console.log(overallvalue);

// console.log(
//   allmovements.flat().sort((a, b) => {
//     if (a < b) {
//       return -1; //keep order
//     } else {
//       return 1; //switch order
//     }
//   })
// );
//////////////////////////  Coding challenge - 4   ///////////////////////
// const dogs = [
//   {
//     weight: 22,
//     curFood: 250,
//     owners: ['Alice', 'Bob'],
//   },
//   {
//     weight: 8,
//     curFood: 200,
//     owners: ['Matilda'],
//   },
//   {
//     weight: 13,
//     curFood: 275,
//     owners: ['Sarah', 'John'],
//   },
//   {
//     weight: 32,
//     curFood: 340,
//     owners: ['Michael'],
//   },
// ];
// //1.
// const recFood = function (dogs) {
//   dogs.map(item => (item.recFood = Math.trunc(item.weight ** 0.75 * 28)));
// };
// recFood(dogs);
// console.log(dogs);
// //2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.recFood > dogSarah.curFood ? 'little' : 'much'
//   }`
// );
// //3.
// const ownerseatTooMuch = dogs
//   .filter(item => item.recFood < item.curFood)
//   .flatMap(dog => dog.owners);
// const ownerseatTooLittle = dogs
//   .filter(item => item.recFood > item.curFood)
//   .flatMap(dog => dog.owners);

// console.log(ownerseatTooLittle);
// console.log(ownerseatTooMuch);
// //4.
// console.log(`${ownerseatTooMuch.join("'s and ")}'s dogs eat too much`);
// console.log(`${ownerseatTooLittle.join("'s and ")}'s dogs eat too little`);
// //5.
// console.log(
//   dogs.some(
//     item =>
//       item.curFood > item.recFood * 0.9 && item.curFood < item.recFood * 1.1
//   )
// );
// //7
// console.log(
//   dogs.filter(
//     item =>
//       item.curFood > item.recFood * 0.9 && item.curFood < item.recFood * 1.1
//   )
// );
// //8
// const sortedDogs = dogs.sort((a, b) => a.recFood - b.recFood);
// console.log(sortedDogs);
//
///Creating dates
