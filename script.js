// DOM
numberBtns = document.querySelectorAll('.btn-number');
operatorBtns = document.querySelectorAll('.btn-operator');

equalsBtn = document.querySelector('.btn-equals');
clearBtn = document.querySelector('.btn-clear');
deleteBtn = document.querySelector('.btn-delete');
decimalBtn = document.querySelector('.btn-decimal');

// Functions 
function handleNumberClick(e) {
  const number = e.target.textContent;
  console.log(`Number Button '${number}' was clicked`);
}

function handleOperatorClick(e) {
  const operator = e.target.textContent;
  console.log(`Operator button '${operator}' was clicked`);
}

function handleClearClick(e) {
  console.log(`The button clear 'C' was clicked!`);
}

function handleEqualsClick(e) {
  console.log(`The button equals '=' was clicked!`);
}

function handleDeleteClick(e) {
  console.log(`The button 'DEL' was clicked!`);
}

function handleDecimalClick(e) {
  console.log(`The button decmial '.' was clicked!`);
}

// Event listeners
numberBtns.forEach(numberBtn => {
  numberBtn.addEventListener('click', handleNumberClick);
});

operatorBtns.forEach(operatorBtn => {
  operatorBtn.addEventListener('click', handleOperatorClick);
});

clearBtn.addEventListener('click', handleClearClick);
equalsBtn.addEventListener('click', handleEqualsClick);
deleteBtn.addEventListener('click', handleDeleteClick)
decimalBtn.addEventListener('click', handleDecimalClick);