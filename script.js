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
    '2023-10-31T10:51:36.790Z',
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
//Date formatting
const formatDate = function (input) {
  const givendate = new Date(input);
  const day = `${givendate.getDate()}`.padStart(2, 0);
  const month = `${givendate.getMonth() + 1}`.padStart(2, 0);
  const year = givendate.getFullYear();
  const hours = givendate.getHours();
  const min = `${givendate.getMinutes()}`.padStart(2, 0);
  const currentdate = new Date();
  const dayspassed = Math.abs(givendate - currentdate) / 86400000;
  if (dayspassed < 1) return `Today at ${hours}:${min}`;
  else if (dayspassed > 1 && dayspassed < 2)
    return `Yesterday at ${hours}:${min}`;
  else {
    return `on ${day}/${month}/${year}, ${hours}:${min}`;
  }
};
//
//Display Resultant balance
const calcDisplayBalance = function (acc) {
  const blance = Number(acc.movements.reduce((acc, item) => acc + item));
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
    //Date
    const displaydate = `${formatDate(new Date(acc.movementsDates[i]))}`;
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displaydate}</div>
          <div class="movements__value">${Number(move).toFixed(2)}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const Inflow = Number(
    acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov)
  );
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
// //Fake login always
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// //
//Adding times
labelDate.textContent = formatDate(new Date());

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
    timerout();
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
    setTimeout(function () {
      currentAccount.movements.push(Number(inputAmt));
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
      setTimeout(() => alert('Loan successfully deposited!'), 0);
    }, 4000);
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
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
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
    setTimeout(() => {
      alert('Account deleted successfully, sorry to see you go!!😔🥺');
    }, 0);
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
//
// Logout timer
const timerout = function () {
  //set time to 5 minutes
  let timeRem = 300;
  //run till 5 minutes gets ended, and display the time each second

  setInterval(function () {
    const min = String(Math.trunc(timeRem / 60)).padStart(2, 0);
    const sec = String(timeRem % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    timeRem--;
    if (timeRem === 0) {
      clearTimeout(timerout);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      setTimeout(function () {
        alert('You have been logged out due to Timer out');
      }, 0);
    }
  }, 1000);

};
