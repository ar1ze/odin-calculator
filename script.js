// A string of all valid calculator operators.
const OPERATORS = '+-*/%';

// An array to store the sequence of numbers and operators for the calculation.
let answerArray = [0];

// DOM element selectors.
const numberBtns = document.querySelectorAll('.btn-number');
const operatorBtns = document.querySelectorAll('.btn-operator');
const equalsBtn = document.querySelector('.btn-equals');
const clearBtn = document.querySelector('.btn-clear');
const deleteBtn = document.querySelector('.btn-delete');
const decimalBtn = document.querySelector('.btn-decimal');
const answerDisplay = document.querySelector('.answer-display');

// Functions
function handleNumberClick(e) {
  const number = e.target.textContent;
  pushToAnswerArray(number);
  updateAnswerDisplay();
  console.log(`Number Button '${number}' was clicked`);
}

function handleOperatorClick(e) {
  const operator = e.target.textContent;
  pushToAnswerArray(operator);
  updateAnswerDisplay();
  console.log(`Operator button '${operator}' was clicked`);
}

function handleClearClick() {
  console.log(`The button clear 'C' was clicked!`);
  clearAnswerArray();
  updateAnswerDisplay();
}

function handleEqualsClick() {
  console.log(`The button equals '=' was clicked!`);
}

function handleDeleteClick() {
  console.log(`The button 'DEL' was clicked!`);
}

function handleDecimalClick() {
  console.log(`The button decmial '.' was clicked!`);
}

// Pushes a character to the answerArray, handling multi-digit numbers.
function pushToAnswerArray(char) {
  // If the array starts with zero, remove it.
  if (!answerArray[0]) {
    answerArray.shift();
  }

  let lastIndex = answerArray.length - 1;
  let lastChar = answerArray[lastIndex];

  // If the new character or the last character is an operator, add a new element.
  if (
    OPERATORS.includes(char) ||
    OPERATORS.includes(lastChar) ||
    answerArray.length === 0
  ) {
    answerArray.push(char);
  } else {
    // Otherwise, append the new character to the last element to form a multi-digit number.
    answerArray[lastIndex] += char;
  }
}

// Resets the answerArray to a single element of 0.
function clearAnswerArray() {
  answerArray = [0];
}

function updateAnswerDisplay() {
  console.log(answerArray);
  answerDisplay.textContent = answerToString(answerArray);
}

// Joins the elements of the array into a single string with spaces.
function answerToString(array) {
  return array.join(' ');
}

// Event listeners
numberBtns.forEach((numberBtn) => {
  numberBtn.addEventListener('click', handleNumberClick);
});

operatorBtns.forEach((operatorBtn) => {
  operatorBtn.addEventListener('click', handleOperatorClick);
});

clearBtn.addEventListener('click', handleClearClick);
equalsBtn.addEventListener('click', handleEqualsClick);
deleteBtn.addEventListener('click', handleDeleteClick);
decimalBtn.addEventListener('click', handleDecimalClick);
