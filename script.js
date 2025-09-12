// Calculator operators for validation
const OPERATORS = ['+', '-', 'x', '/', '%'];

// Stores calculation as array of numbers and operators
let answerArray = ['0'];

// DOM elements
const numberBtns = document.querySelectorAll('.btn-number');
const operatorBtns = document.querySelectorAll('.btn-operator');
const equalsBtn = document.querySelector('.btn-equals');
const clearBtn = document.querySelector('.btn-clear');
const deleteBtn = document.querySelector('.btn-delete');
const decimalBtn = document.querySelector('.btn-decimal');
const answerDisplay = document.querySelector('.answer-display');

// Event handlers
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
  clearAnswerArray();
  updateAnswerDisplay();
  console.log(`The button clear 'C' was clicked!`);
}

function handleEqualsClick() {
  console.log(`The button equals '=' was clicked!`);
}

function handleDeleteClick() {
  deleteLastInArray();
  updateAnswerDisplay();
  console.log(`The button 'DEL' was clicked!`);
}

function handleDecimalClick() {
  console.log(`The button decmial '.' was clicked!`);
}

// Adds character to array, combining consecutive digits into multi-digit numbers
function pushToAnswerArray(char) {
  let arrayStartsWithZero = answerArray.at(0) === '0';
  let isCharOperator = OPERATORS.includes(char);

  let lastElement = answerArray.slice(-1).at(0);
  let lastElementIsOperator = OPERATORS.includes(lastElement);

  // Prevent consecutive operators
  if (isCharOperator && lastElementIsOperator) return;

  // Replace leading zero with first number
  if (arrayStartsWithZero && !isCharOperator && !lastElementIsOperator) {
    answerArray.shift();
  }

  let arrayIsEmpty = answerArray.length === 0;
  if (isCharOperator || lastElementIsOperator || arrayIsEmpty) {
    answerArray.push(char);
  } else {
    // Combine digits to form multi-digit numbers
    answerArray.splice(-1, 1, lastElement + char);
  }
}

// Removes last character or element from array
function deleteLastInArray() {
  let lastElement = answerArray.slice(-1).at(0);
  let lastElementArray = lastElement.split('');

  let isOperatorLast = OPERATORS.includes(lastElement);
  let isAnswerSingleElement = answerArray.length === 1;
  let isLastElementSingleChar = lastElementArray.length === 1;

  // Reset to '0' if deleting the last remaining character
  if (isAnswerSingleElement && isLastElementSingleChar) {
    clearAnswerArray();
    return;
  }

  if (isOperatorLast || isLastElementSingleChar) {
    answerArray.pop();
  } else {
    // Remove last digit from multi-digit number
    lastElementArray.splice(-1, 1);
    answerArray.splice(-1, 1, lastElementArray.join(''));
  }
}

function clearAnswerArray() {
  answerArray = ['0'];
}

function updateAnswerDisplay() {
  answerDisplay.textContent = answerToString(answerArray);
}

// Converts array to display string with spaces between elements
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