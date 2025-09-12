const DECIMAL_POINT = '.';
const OPERATORS = ['+', '-', 'x', '/', '%'];

// Stores the calculation as an array of numbers and operators
let calculationParts = ['0'];

// DOM elements
const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const equalsButton = document.querySelector('.btn-equals');
const clearButton = document.querySelector('.btn-clear');
const deleteButton = document.querySelector('.btn-delete');
const decimalButton = document.querySelector('.btn-decimal');
const calculationDisplay = document.querySelector('.answer-display');

// Event handlers
function handleNumberClick(event) {
  const numberValue = event.target.textContent;
  addToCalculation(numberValue);
  updateDisplay();
  console.log(`Number Button '${numberValue}' was clicked`);
}

function handleOperatorClick(event) {
  const operatorValue = event.target.textContent;
  addToCalculation(operatorValue);
  updateDisplay();
  console.log(`Operator button '${operatorValue}' was clicked`);
}

function handleClearClick() {
  clearCalculation();
  updateDisplay();
  console.log(`The button clear 'C' was clicked!`);
}

function handleDeleteClick() {
  deleteLastInput();
  updateDisplay();
  console.log(`The button 'DEL' was clicked!`);
}

function handleDecimalClick(event) {
  const decimalValue = event.target.textContent;
  addToCalculation(decimalValue);
  updateDisplay();
  console.log(`The button decimal '.' was clicked!`);
}

function handleEqualsClick() {
  console.log(`The button equals '=' was clicked!`);
}

// Adds a character to the calculation array, handling complex logic
function addToCalculation(inputValue) {
  let isCalculationInitiallyZero = calculationParts.at(0) === '0';

  let isInputAnOperator = OPERATORS.includes(inputValue);
  let isInputADecimal = inputValue === DECIMAL_POINT;

  let lastPart = calculationParts.slice(-1).at(0);
  let lastCharOfLastPart = lastPart.slice(-1);
  let isLastPartAnOperator = OPERATORS.includes(lastPart);
  let isLastCharOfLastPartADecimal = lastCharOfLastPart === DECIMAL_POINT;
  let lastPartContainsDecimal = lastPart.includes(DECIMAL_POINT);

  let isInputOrLastPartAnOperator = isInputAnOperator || isLastPartAnOperator;
  let areInputAndLastPartOperators = isInputAnOperator && isLastPartAnOperator;
  let areInputAndLastCharDecimals =
    isInputADecimal && isLastCharOfLastPartADecimal;

  // Prevent invalid inputs like consecutive operators or decimals
  if (areInputAndLastPartOperators) return;
  if (areInputAndLastCharDecimals) return;

  // Handle replacing the initial '0'
  if (isCalculationInitiallyZero && !areInputAndLastPartOperators) {
    if (isInputADecimal && isCalculationInitiallyZero) {
      // Convert "0" to "0."
      calculationParts.splice(-1, 1, lastPart + inputValue);
    } else {
      // Remove leading zero for new numbers
      calculationParts.shift();
    }
  }

  let isCalculationEmpty = calculationParts.length === 0;
  // Decide whether to start a new calculation part or append to the current one.
  if (isInputOrLastPartAnOperator || isCalculationEmpty) {
    if (isLastPartAnOperator && isInputADecimal) {
      // Add "0." after an operator if a decimal is pressed
      calculationParts.push('0' + inputValue);
    } else {
      calculationParts.push(inputValue);
    }
  } else {
    // Prevent multiple decimals in one number
    if (lastPartContainsDecimal && isInputADecimal) return;

    // Append to the existing number
    calculationParts.splice(-1, 1, lastPart + inputValue);
  }
}

// Removes the last character or element from the calculation array
function deleteLastInput() {
  let lastPart = calculationParts.slice(-1).at(0);
  let lastPartAsCharArray = lastPart.split('');

  let isLastPartAnOperator = OPERATORS.includes(lastPart);
  let isCalculationASinglePart = calculationParts.length === 1;
  let isLastPartASingleChar = lastPartAsCharArray.length === 1;

  // Reset to '0' if deleting the very last character on screen
  if (isCalculationASinglePart && isLastPartASingleChar) {
    clearCalculation();
    return;
  }

  if (isLastPartAnOperator || isLastPartASingleChar) {
    calculationParts.pop();
  } else {
    // Remove the last character from a multi-digit number
    lastPartAsCharArray.pop();
    calculationParts.splice(-1, 1, lastPartAsCharArray.join(''));
  }
}

function clearCalculation() {
  calculationParts = ['0'];
}

function updateDisplay() {
  calculationDisplay.textContent =
    formatCalculationForDisplay(calculationParts);
}

// Converts the calculation array to a string for display
function formatCalculationForDisplay(parts) {
  return parts.join(' ');
}

// Event listeners
numberButtons.forEach((button) => {
  button.addEventListener('click', handleNumberClick);
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', handleOperatorClick);
});

clearButton.addEventListener('click', handleClearClick);
equalsButton.addEventListener('click', handleEqualsClick);
deleteButton.addEventListener('click', handleDeleteClick);
decimalButton.addEventListener('click', handleDecimalClick);