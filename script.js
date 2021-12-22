let operand1;
let operand2;
let operator;
let result;

init();

const backspace = (s) => s.slice(0, s.length - 1);

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const hasDecimal = (s) => s.includes('.');

function formatNumber(s) {
    return removeTrailingZeroesAfterDecimal(parseFloat(s).toFixed(9));
}

function removeTrailingZeroesAfterDecimal(s) {
    if (hasDecimal(s)) {
        while (s.endsWith('0') ||s.endsWith('.')) {
            s = s.slice(0, s.length - 1);
        }
    }

    return s;
}

function operate(op, a, b) {
    let f = Object;
    
    switch (op) {
        case '+':
            f = add;
            break;
        case '-':
            f = subtract;
            break;
        case '*':
            f = multiply;
            break;
        case '/':
            f = divide;
            break;
    }

    return f(a, b);
}

function init() {
    addButtonEventHandlers();
    reset();
    updateDisplay();
}

function reset() {
    result = null;
    operator = null;
    operand1 = '';
    operand2 = '';
}

function addButtonEventHandlers() {
    const numberBtns = document.querySelectorAll('.btns__number')
    numberBtns.forEach((btn) => btn.addEventListener('click', handleNumber));

    const operatorBtns = document.querySelectorAll('.btns__op')
    operatorBtns.forEach((btn) => btn.addEventListener('click', handleOperator));

    const clearBtn = document.querySelector('.btns__clear');
    clearBtn.addEventListener('click', handleClear);

    const backBtn = document.querySelector('.btns__back');
    backBtn.addEventListener('click', handleBack);

    const equalsBtn = document.querySelector('.btns__equals');
    equalsBtn.addEventListener('click', handleEquals);
}

function handleNumber(e) {
    if (result) {
        reset();
    }

    let btnVal = e.target.textContent;
    
    if (operator) {
        if (btnVal != '.' || !hasDecimal(operand2)) {
            operand2 += btnVal
            if (operand2 === '.') operand2 = '0.';
        }
    } else {
        if (btnVal != '.' || !hasDecimal(operand1)) {
            operand1 += btnVal
            if (operand1 === '.') operand1 = '0.';
        }
    }

    updateDisplay();
}

function handleOperator(e) {
    if (result) {
        let saveResult = result;
        reset();
        
        operand1 = saveResult;
    }
    else if (!operand1 || operator) {
        // operand1 not entered, or operator already entered.
        return;
    }

    operator = e.target.dataset['op'];
    
    updateDisplay();
}

function handleClear() {
    reset();

    updateDisplay();
}

function handleBack() {
    // Determine what has been entered so far and remove
    // the most recent entry.
    if (operand2) {
        operand2 = backspace(operand2);

    } else if (operator) {
        operator = null;

    } else if (operand1) {
        operand1 = backspace(operand1);

    } else {
        return;

    }

    updateDisplay();
}

function handleEquals() {
    if (!(operand1 && operator && operand2)) return;

    result = operate(operator, parseFloat(operand1), parseFloat(operand2));
    result = formatNumber(result);
   
    updateDisplay();
}

function getOperatorString(op) {
    switch (op) {
        case '/':
            return '\xF7';
            break;
        case '*':
            return '\xD7';
            break;
        default:
            return op;
    }
}

function getDisplayString() {
    if (result) {
        return formatNumber(result);
    }
    
    let s = '';
    if (operand1) s += operand1;
    if (operator) s += getOperatorString(operator);
    if (operand2) s += operand2;

    if (!s) s = '0';

    return s;
}

function updateDisplay() {
    document.querySelector('.display__output').textContent = getDisplayString();
}