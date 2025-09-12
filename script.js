const DECIMAL_POINT = '.';
const OPERATORS = ['+', '-', 'x', '/', '%'];
const PLUS_MINUS_SYMBOLS = ['(', '-', ')'];

// Stores the current calculation sequence of operands and operators.
let calculationSequence = ['0'];

// DOM elements
const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const equalsButton = document.querySelector('.btn-equals');
const clearButton = document.querySelector('.btn-clear');
const deleteButton = document.querySelector('.btn-delete');
const decimalButton = document.querySelector('.btn-decimal');
const calculationDisplay = document.querySelector('.answer-display');
const plusMinusToggleButton = document.querySelector('.btn-plus-minus');

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

function handlePlusMinusToggleClick() {
  togglePlusMinus();
  updateDisplay();
  console.log(`The button plus minus '+/-' was clicked!`);
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

function isPartToggled(partAsArray) {
  let plusMinusSymbolCount = partAsArray.reduce((sum, currentCharacter) => {
    let isPlusMinusSymbol = PLUS_MINUS_SYMBOLS.includes(currentCharacter);
    if (isPlusMinusSymbol) return ++sum;
    else return sum;
  }, 0);
  return plusMinusSymbolCount === 3;
}

function convertToPositivePart(partAsArray) {
  return partAsArray.reduce((accumulatedString, currentCharacter) => {
    let isPlusMinusSymbol = PLUS_MINUS_SYMBOLS.includes(currentCharacter);
    if (!isPlusMinusSymbol) return accumulatedString + currentCharacter;
    else return accumulatedString;
  }, '');
}

function convertToNegativePart(part) {
  return '(-' + part + ')';
}

function togglePlusMinus() {
  let isCalculationInitiallyZero = calculationSequence.at(0) === '0';
  let lastPart = calculationSequence.slice(-1).at(0);
  let isLastPartAnOperator = OPERATORS.includes(lastPart);

  // Do nothing if display is "0" or the last entry is an operator.
  if (isCalculationInitiallyZero || isLastPartAnOperator) return;

  let lastPartAsArray = lastPart.split('');
  let isCurrentlyToggled = isPartToggled(lastPartAsArray);
  let toggledPart;

  if (isCurrentlyToggled) {
    toggledPart = convertToPositivePart(lastPartAsArray);
  } else {
    toggledPart = convertToNegativePart(lastPart);
  }

  calculationSequence.splice(-1, 1, toggledPart);
}

// Adds user input to the calculation sequence, handling complex logic.
function addToCalculation(inputValue) {
  let isCalculationInitiallyZero = calculationSequence.at(0) === '0';

  let isInputAnOperator = OPERATORS.includes(inputValue);
  let isInputADecimal = inputValue === DECIMAL_POINT;

  let lastPart = calculationSequence.slice(-1).at(0);
  let lastPartAsArray = lastPart.split('');
  let lastCharOfLastPart = lastPart.slice(-1);

  let isLastPartAnOperator = OPERATORS.includes(lastPart);
  let isLastCharOfLastPartADecimal = lastCharOfLastPart === DECIMAL_POINT;
  let lastPartContainsDecimal = lastPart.includes(DECIMAL_POINT);

  let isInputOrLastPartAnOperator = isInputAnOperator || isLastPartAnOperator;
  let areInputAndLastPartOperators = isInputAnOperator && isLastPartAnOperator;
  let areInputAndLastCharDecimals =
    isInputADecimal && isLastCharOfLastPartADecimal;

  // Prevent invalid inputs like consecutive operators or decimals.
  if (areInputAndLastPartOperators) return;
  if (areInputAndLastCharDecimals) return;

  // Handle replacing the initial '0'.
  if (isCalculationInitiallyZero && !areInputAndLastPartOperators) {
    if (isInputADecimal && isCalculationInitiallyZero) {
      // Convert "0" to "0."
      calculationSequence.splice(-1, 1, lastPart + inputValue);
    } else {
      // Remove leading zero for new numbers.
      calculationSequence.shift();
    }
  }

  let isCalculationEmpty = calculationSequence.length === 0;
  // Decide whether to start a new calculation part or append to the current one.
  if (isInputOrLastPartAnOperator || isCalculationEmpty) {
    if (isLastPartAnOperator && isInputADecimal) {
      // Add "0." after an operator if a decimal is pressed.
      calculationSequence.push('0' + inputValue);
    } else {
      calculationSequence.push(inputValue);
    }
  } else {
    // Prevent multiple decimals in one number.
    if (lastPartContainsDecimal && isInputADecimal) return;

    let isToggled = isPartToggled(lastPartAsArray);
    if (isToggled) {
      // Add multiply operator before the input if the last part is toggled negative.
      calculationSequence.push('x');

      // Append zero before decimal if needed.
      if (isInputADecimal) {
        inputValue = '0' + inputValue;
      }

      calculationSequence.push(inputValue);
    } else {
      calculationSequence.splice(-1, 1, lastPart + inputValue);
    }
  }
}

// Removes the last character or element from the calculation array.
function deleteLastInput() {
  let lastPart = calculationSequence.slice(-1).at(0);
  let lastPartAsArray = lastPart.split('');

  let isLastPartAnOperator = OPERATORS.includes(lastPart);
  let isCalculationASinglePart = calculationSequence.length === 1;
  let isLastPartASingleChar = lastPartAsArray.length === 1;

  // Reset to '0' if deleting the very last character on screen.
  if (isCalculationASinglePart && isLastPartASingleChar) {
    clearCalculation();
    return;
  }

  if (isLastPartAnOperator || isLastPartASingleChar) {
    calculationSequence.pop();
  } else {
    // Remove the last character from a multi-digit number.
    lastPartAsArray.pop();
    calculationSequence.splice(-1, 1, lastPartAsArray.join(''));
  }
}

function clearCalculation() {
  calculationSequence = ['0'];
}

function updateDisplay() {
  console.log(calculationSequence);
  calculationDisplay.textContent =
    formatCalculationForDisplay(calculationSequence);
}

// Converts the calculation array to a string for display.
function formatCalculationForDisplay(sequence) {
  return sequence.join(' ');
}

// Event listeners
numberButtons.forEach((button) => {
  button.addEventListener('click', handleNumberClick);
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', handleOperatorClick);
});

clearButton.addEventListener('click', handleClearClick);
plusMinusToggleButton.addEventListener('click', handlePlusMinusToggleClick);
equalsButton.addEventListener('click', handleEqualsClick);
deleteButton.addEventListener('click', handleDeleteClick);
decimalButton.addEventListener('click', handleDecimalClick);