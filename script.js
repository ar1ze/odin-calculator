const decimalPointCharacter = '.';
const supportedOperators = ['+', '-', 'x', '/', '%'];
// Defines the order of operations (PEMDAS/BODMAS).
const operatorPrecedenceOrder = ['x', '/', '%', '+', '-'];
// Using '(-...)' avoids ambiguity between a negative number and the subtraction operator.
const negationWrapperCharacters = ['(', '-', ')'];

// Define key groups as constants
const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const decimalKeys = ['.', ','];
const clearKeys = ['c'];
const toggleSignKeys = ['n'];
const equalsKeys = ['=', 'Enter'];
const backspaceKeys = ['Backspace'];
const operatorKeys = ['+', '-', '/', '*', '%'];

// Holds the expression as an array of tokens, e.g., ['5', '+', '10'].
let expressionTokens = ['0'];

const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const clearButton = document.querySelector('.btn-clear');
const toggleSignButton = document.querySelector('.btn-plus-minus');
const backspaceButton = document.querySelector('.btn-backspace');
const decimalButton = document.querySelector('.btn-decimal');
const evaluateButton = document.querySelector('.btn-equals');
const expressionDisplay = document.querySelector('.answer-display');
const historyDisplay = document.querySelector('.history-display');

function handleNumberButtonClick(event) {
  const numberValue = event.target.textContent;
  processInput(numberValue);
  updateAnswerDisplay();
}

function handleOperatorButtonClick(event) {
  const operatorValue = event.target.textContent;
  processInput(operatorValue);
  updateAnswerDisplay();
}

function handleClearButtonClick() {
  displayInitialHistoryExpression();
  resetTokenExpression();
  updateAnswerDisplay();
}

function handleToggleSignButtonClick() {
  toggleLastOperandSign();
  updateAnswerDisplay();
}

function handleBackspaceButtonClick() {
  processBackspace();
  updateAnswerDisplay();
}

function handleDecimalButtonClick(event) {
  const decimalValue = event.target.textContent;
  processInput(decimalValue);
  updateAnswerDisplay();
}

function handleEvaluateButtonClick() {
  evaluateExpression();
  updateAnswerDisplay();
}

function isOperandWrappedAsNegative(operandCharacters) {
  let hasLeadingMinusSign = operandCharacters.at(0) === '-';

  let negationCharacterCount = operandCharacters.reduce((count, character) => {
    let isNegationCharacter = negationWrapperCharacters.includes(character);
    if (isNegationCharacter) return ++count;
    else return count;
  }, 0);

  // A negated operand is wrapped, e.g., '(-5)', which has 3 wrapper characters.
  return negationCharacterCount === 3 || hasLeadingMinusSign;
}

// Extracts the number from a negated token, e.g., '(-5)' -> '5'.
function unwrapNegatedOperand(negatedOperandCharacters) {
  return negatedOperandCharacters.reduce((unwrappedOperand, character) => {
    let isNegationCharacter = negationWrapperCharacters.includes(character);
    if (!isNegationCharacter) return unwrappedOperand + character;
    else return unwrappedOperand;
  }, '');
}

// Wraps a number token to represent negation, e.g., '5' -> '(-5)'.
function wrapOperandAsNegative(operandValue) {
  return '(-' + operandValue + ')';
}

function toggleLastOperandSign() {
  let isExpressionDefaultZero = expressionTokens.at(0) === '0';
  let lastToken = expressionTokens.slice(-1).at(0);
  let isLastTokenAnOperator = supportedOperators.includes(lastToken);

  // Prevent toggling the initial '0' or an operator.
  if (isExpressionDefaultZero || isLastTokenAnOperator) return;

  let lastOperandCharacters = lastToken.split('');
  let isCurrentlyNegated = isOperandWrappedAsNegative(lastOperandCharacters);
  let toggledOperand;

  // Swap between the positive and negated form of the operand.
  if (isCurrentlyNegated) {
    toggledOperand = unwrapNegatedOperand(lastOperandCharacters);
  } else {
    toggledOperand = wrapOperandAsNegative(lastToken);
  }

  expressionTokens.splice(-1, 1, toggledOperand);
}

function addNewTokenToExpression(token) {
  let lastToken = expressionTokens.slice(-1).at(0);
  let isLastTokenAnOperator = supportedOperators.includes(lastToken);
  let isTokenADecimal = token === decimalPointCharacter;

  let newTokenValue = token;

  // Prepend '0' for a more readable format if a decimal point follows an operator.
  if (isLastTokenAnOperator && isTokenADecimal) {
    newTokenValue = '0' + token;
  }

  expressionTokens.push(newTokenValue);
}

function appendToLastTokenInExpression(character) {
  let isCharacterADecimal = character === decimalPointCharacter;

  let lastOperand = expressionTokens.slice(-1).at(0);
  let hasLastOperandDecimal = lastOperand.includes(decimalPointCharacter);

  // Prevent multiple decimals in one operand.
  if (hasLastOperandDecimal && isCharacterADecimal) return;

  let isLastOperandNegated =
    lastOperand.startsWith('(') && lastOperand.endsWith(')');
  if (isLastOperandNegated && isCharacterADecimal) {
    // If the last token is negated, e.g., '(-5)', a new number implies
    // multiplication, e.g., '(-5)' then '2' becomes '(-5) x 2'.
    expressionTokens.push('x');
    character = '0' + character;
    expressionTokens.push(character);
  } else {
    let updatedOperand = lastOperand + character;
    let isLastOperandZero = lastOperand === '0';

    // Overwrite the initial '0' instead of appending to it.
    if (isLastOperandZero && !isCharacterADecimal) {
      updatedOperand = character;
    }

    expressionTokens.splice(-1, 1, updatedOperand);
  }
}

// This function acts as a router, deciding whether user input should
// create a new token or be appended to the last one.
function processInput(input) {
  let isExpressionEmpty = expressionTokens.length === 0;

  let isInputAnOperator = supportedOperators.includes(input);
  let isInputADecimal = input === decimalPointCharacter;

  let lastToken = expressionTokens.slice(-1).at(0);
  let lastCharacterOfToken = lastToken.slice(-1);

  let isLastTokenAnOperator = supportedOperators.includes(lastToken);
  let isLastCharacterADecimal = lastCharacterOfToken === decimalPointCharacter;
  let shouldStartNewToken = isInputAnOperator || isLastTokenAnOperator;

  let isRedundantOperator = isInputAnOperator && isLastTokenAnOperator;
  let isRedundantDecimal = isInputADecimal && isLastCharacterADecimal;

  // Prevent invalid sequences like '5 + + 2' or '5..2'.
  if (isRedundantOperator || isRedundantDecimal) return;

  // A new token is needed if the sequence is empty or the last input was an operator.
  if (shouldStartNewToken || isExpressionEmpty) {
    addNewTokenToExpression(input);
  } else {
    appendToLastTokenInExpression(input);
  }
}

function processBackspace() {
  let lastToken = expressionTokens.slice(-1).at(0);
  let lastTokenCharacters = lastToken.split('');

  let isLastTokenAnOperator = supportedOperators.includes(lastToken);
  let isExpressionASingleToken = expressionTokens.length === 1;
  let isLastTokenSingleCharacter = lastTokenCharacters.length === 1;

  // Reset to '0' if deleting the final character on screen.
  if (isExpressionASingleToken && isLastTokenSingleCharacter) {
    resetTokenExpression();
    return;
  }

  // Operators or single-digit numbers are removed entirely.
  if (isLastTokenAnOperator || isLastTokenSingleCharacter) {
    expressionTokens.pop();
  } else {
    // For a multi-character token, just remove its last character.
    lastTokenCharacters.pop();
    expressionTokens.splice(-1, 1, lastTokenCharacters.join(''));
  }
}

// Evaluates the expression by repeatedly finding the highest-precedence
// operator and executing its operation until only the result remains.
function evaluateExpression() {
  let lastToken = expressionTokens.slice(-1).at(0);
  let tokenCount = expressionTokens.length;
  let isLastTokenAnOperator = supportedOperators.includes(lastToken);

  // An expression can't be evaluated if it's a single number or ends with an operator.
  if (tokenCount === 1 || isLastTokenAnOperator) return;

  let history = expressionTokens.slice();
  updateHistoryDisplay(history);

  expressionTokens = parseTokensForEvaluation(expressionTokens);

  // Reduce the expression by solving one operation at a time, respecting precedence.
  do {
    let operatorIndex = getHighestPrecedenceOperatorIndex(expressionTokens);
    let leftOperandIndex = operatorIndex - 1;
    let rightOperandIndex = operatorIndex + 1;

    let leftOperand = expressionTokens[leftOperandIndex];
    let rightOperand = expressionTokens[rightOperandIndex];
    let operator = expressionTokens[operatorIndex];

    let result = performOperation(leftOperand, rightOperand, operator);
    // Handle division by zero or other invalid operations.
    if (result === undefined) {
      expressionTokens = [undefined];
      break;
    }

    if (result % 1 !== 0) {
      result = result.toFixed(2);
    }

    // Replace the processed chunk (e.g., [2, '+', 3]) with its result (e.g., [5]).
    expressionTokens.splice(leftOperandIndex, 3, result);
  } while (expressionTokens.length > 1);

  // Convert the final result back to a string for display and further calculations.
  expressionTokens[0] = String(expressionTokens[0]);
}

// Prepares the token sequence for evaluation by converting string numbers to actual numbers.
function parseTokensForEvaluation(tokens) {
  return tokens.map((token) => {
    let isTokenIncludeOperator = supportedOperators.includes(token);
    let isTokenSingleLength = token.length === 1;
    let isOperator = isTokenIncludeOperator && isTokenSingleLength;

    if (isOperator) return token;

    // Unwrap negated numbers like '(-5)' into a processable '-5'.
    let tokenCharacters = token.split('');
    let isTokenNegated = isOperandWrappedAsNegative(tokenCharacters);
    let tokenContainParantheses = token.includes('(') && token.includes(')');
    if (isTokenNegated && tokenContainParantheses) {
      token = token.slice(1, -1);
    }

    let isTokenDecimal = token.includes('.');
    return isTokenDecimal ? parseFloat(token) : parseInt(token);
  });
}

function filterOperatorsFromTokens(tokens) {
  return tokens.filter((token) => supportedOperators.includes(token));
}

// Finds the index of the operator that should be evaluated next.
function getHighestPrecedenceOperatorIndex(tokens) {
  let operatorsInExpression = filterOperatorsFromTokens(tokens);
  // Iterating through the precedence array ensures we find the operator
  // with the highest priority first.
  for (let operator of operatorPrecedenceOrder) {
    let operatorIndex = operatorsInExpression.indexOf(operator);
    if (operatorIndex !== -1) return tokens.indexOf(operator);
  }
}

function performOperation(leftOperand, rightOperand, operator) {
  switch (operator) {
    case '+':
      return leftOperand + rightOperand;
    case '-':
      return leftOperand - rightOperand;
    case 'x':
      return leftOperand * rightOperand;
    case '/':
      return rightOperand === 0 ? undefined : leftOperand / rightOperand;
    case '%':
      return leftOperand % rightOperand;
    default:
      return undefined;
  }
}

function resetTokenExpression() {
  expressionTokens = ['0'];
}

function displayInitialHistoryExpression() {
  let historyTokens = [''];
  updateHistoryDisplay(historyTokens);
}

function updateAnswerDisplay() {
  expressionDisplay.textContent = formatTokensForDisplay(expressionTokens);
  setTimeout(() => {
    expressionDisplay.scrollLeft = expressionDisplay.scrollWidth;
  }, 0);
}

function updateHistoryDisplay(history) {
  historyDisplay.textContent = formatTokensForDisplay(history);
}

function formatTokensForDisplay(tokens) {
  return tokens.join(' ');
}

function createTextContentEvent(textContent) {
  return { target: { textContent: textContent } };
}

function handleKeyPress(event) {
  let keyPressed = event.key;
  console.log(`The key '${keyPressed}' was pressed`);
  console.log(typeof keyPressed);

  let numberKeyPress = numberKeys.includes(keyPressed);
  let decimalKeyPress = decimalKeys.includes(keyPressed);
  let clearKeyPress = clearKeys.includes(keyPressed);
  let toggleSignKeyPress = toggleSignKeys.includes(keyPressed);
  let equalsKeyPress = equalsKeys.includes(keyPressed);
  let backspaceKeyPress = backspaceKeys.includes(keyPressed);
  let operatorKeyPress = operatorKeys.includes(keyPressed);

  let textContentEvent;
  switch (true) {
    case numberKeyPress:
      textContentEvent = createTextContentEvent(keyPressed);
      handleNumberButtonClick(textContentEvent);
      console.log(`Number Key Press: ${keyPressed}`);
      break;

    case operatorKeyPress:
      keyPressed = keyPressed === '*' ? 'x' : keyPressed;
      textContentEvent = createTextContentEvent(keyPressed);
      handleOperatorButtonClick(textContentEvent);
      console.log(`Operator Key Press: ${keyPressed}`);
      break;

    case decimalKeyPress:
      textContentEvent = createTextContentEvent(keyPressed);
      handleDecimalButtonClick(textContentEvent);
      break;

    case backspaceKeyPress:
      handleBackspaceButtonClick();
      break;

    case clearKeyPress:
      handleClearButtonClick();
      break;

    case toggleSignKeyPress:
      handleToggleSignButtonClick();
      break;

    case equalsKeyPress:
      handleEvaluateButtonClick();
      break;

    default:
      console.log('Yet defined');
  }
}

numberButtons.forEach((button) => {
  button.addEventListener('click', handleNumberButtonClick);
  button.addEventListener('keydown', handleNumberButtonClick);
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', handleOperatorButtonClick);
});

clearButton.addEventListener('click', handleClearButtonClick);
toggleSignButton.addEventListener('click', handleToggleSignButtonClick);
evaluateButton.addEventListener('click', handleEvaluateButtonClick);
backspaceButton.addEventListener('click', handleBackspaceButtonClick);
decimalButton.addEventListener('click', handleDecimalButtonClick);

document.addEventListener('keydown', handleKeyPress);
