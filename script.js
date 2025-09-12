const DECIMAL_POINT = '.';
const OPERATORS = ['+', '-', 'x', '/', '%'];
const NEGATION_WRAPPER_CHARS = ['(', '-', ')'];

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

function isPartNegated(partAsArray) {
  let negationSymbolCount = partAsArray.reduce((sum, currentCharacter) => {
    let isNegationSymbol = NEGATION_WRAPPER_CHARS.includes(currentCharacter);
    if (isNegationSymbol) return ++sum;
    else return sum;
  }, 0);
  return negationSymbolCount === 3;
}

function convertToPositivePart(partAsArray) {
  return partAsArray.reduce((accumulatedString, currentCharacter) => {
    let isNegationSymbol = NEGATION_WRAPPER_CHARS.includes(currentCharacter);
    if (!isNegationSymbol) return accumulatedString + currentCharacter;
    else return accumulatedString;
  }, '');
}

function convertToNegativePart(part) {
  return '(-' + part + ')';
}

function togglePlusMinus() {
  let isCalculationInitiallyZero = calculationSequence.at(0) === '0';
  let lastElement = calculationSequence.slice(-1).at(0);
  let isLastElementAnOperator = OPERATORS.includes(lastElement);

  // Do nothing if display is "0" or the last entry is an operator.
  if (isCalculationInitiallyZero || isLastElementAnOperator) return;

  let lastElementAsArray = lastElement.split('');
  let isCurrentlyNegated = isPartNegated(lastElementAsArray);
  let toggledElement;

  if (isCurrentlyNegated) {
    toggledElement = convertToPositivePart(lastElementAsArray);
  } else {
    toggledElement = convertToNegativePart(lastElement);
  }

  calculationSequence.splice(-1, 1, toggledElement);
}

function insertNewElementToCalculation(inputValue) {
  let lastElement = calculationSequence.slice(-1).at(0);
  let isLastElementAnOperator = OPERATORS.includes(lastElement);
  let isInputADecimal = inputValue === DECIMAL_POINT;

  // Initalize input to the operator input
  let newValue = inputValue;

  // Add "0." after an operator if a decimal is pressed.
  if (isLastElementAnOperator && isInputADecimal) {
    newValue = '0' + inputValue;
  }

  calculationSequence.push(newValue);
}

function appendToLastElementInCalculation(inputValue) {
  let isInputADecimal = inputValue === DECIMAL_POINT;

  let lastElement = calculationSequence.slice(-1).at(0);
  let lastElementAsArray = lastElement.split('');

  let lastElementContainsDecimal = lastElement.includes(DECIMAL_POINT);

  // Prevent multiple decimals in one number.
  if (lastElementContainsDecimal && isInputADecimal) return;

  let isNegated = isPartNegated(lastElementAsArray);
  if (isNegated) {
    // Add multiply operator before the input if the last part is toggled negative.
    calculationSequence.push('x');

    // Append zero before decimal if needed.
    if (isInputADecimal) {
      inputValue = '0' + inputValue;
    }

    // Insert into the sequence
    calculationSequence.push(inputValue);
  } else {
    // Add to the multi digit
    let updatedElement = lastElement + inputValue;
    let isCalculationInitiallyZero = calculationSequence.at(0) === '0';

    // If iniital value is zero just replace it
    if (isCalculationInitiallyZero) {
      updatedElement = inputValue;
    }

    calculationSequence.splice(-1, 1, updatedElement);
  }
}

// Adds user input to the calculation sequence, handling complex logic.
function addToCalculation(inputValue) {
  let isCalculationEmpty = calculationSequence.length === 0;

  let isInputAnOperator = OPERATORS.includes(inputValue);
  let isInputADecimal = inputValue === DECIMAL_POINT;

  let lastElement = calculationSequence.slice(-1).at(0);
  let lastCharOfLastElement = lastElement.slice(-1);

  let isLastElementAnOperator = OPERATORS.includes(lastElement);
  let isLastCharOfLastElementADecimal = lastCharOfLastElement === DECIMAL_POINT;
  let isInputOrLastElementAnOperator =
    isInputAnOperator || isLastElementAnOperator;

  let areInputAndLastElementOperators =
    isInputAnOperator && isLastElementAnOperator;
  let areInputAndLastCharBothDecimals =
    isInputADecimal && isLastCharOfLastElementADecimal;

  // Prevent invalid inputs like consecutive operators or decimals.
  if (areInputAndLastElementOperators || areInputAndLastCharBothDecimals)
    return;

  // Decide whether to start a new calculation part or append to the current one.
  if (isInputOrLastElementAnOperator || isCalculationEmpty) {
    insertNewElementToCalculation(inputValue);
  } else {
    appendToLastElementInCalculation(inputValue);
  }
}

// Removes the last character or element from the calculation array.
function deleteLastInput() {
  let lastElement = calculationSequence.slice(-1).at(0);
  let lastElementAsArray = lastElement.split('');
  let isLastElementAnOperator = OPERATORS.includes(lastElement);
  let isSingleElementCalculation = calculationSequence.length === 1;
  let isLastElementSingleChar = lastElementAsArray.length === 1;

  // Reset to '0' if deleting the very last character on screen.
  if (isSingleElementCalculation && isLastElementSingleChar) {
    clearCalculation();
    return;
  }

  if (isLastElementAnOperator || isLastElementSingleChar) {
    calculationSequence.pop();
  } else {
    // Remove the last character from a multi-digit number.
    lastElementAsArray.pop();
    calculationSequence.splice(-1, 1, lastElementAsArray.join(''));
  }
}

function clearCalculation() {
  calculationSequence = ['0'];
}

function updateDisplay() {
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
