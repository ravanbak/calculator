const MAX_OPERAND_DIGITS = 16;
const MAX_DECIMAL_DIGITS = 9;

let operand1;
let operand2;
let operator;
let result;

init();

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const backspace = (s) => s.slice(0, s.length - 1);
const hasDecimal = (s) => s.includes('.');

function operate(op, a, b) {
    let f = Function;
    
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
    addEventListeners();
    reset();
    updateDisplay();
}

function reset() {
    result = null;
    operator = null;
    operand1 = '';
    operand2 = '';
}

function addEventListeners() {
    document.addEventListener('keydown', handleCalcButtonPress);

    const btns = document.querySelectorAll('button');
    btns.forEach((btn) => {
        btn.addEventListener('mousedown', handleCalcButtonPress);
        btn.addEventListener('transitionend', (e) => transitionFinished(e));
    });
}

function transitionFinished(e) {
    if (e.propertyName === 'transform') {
        e.target.classList.remove('pressed');
    }
}

function handleCalcButtonPress(e) {
    
    // Handle button and keyboard events.
    
    let btn;
    let key;
    if (e.type == 'keydown') {
        btn = document.querySelector(`button[data-key='${e.key}']`);
        key =e.key;
    } 
    else if (e.target.type == 'button') {
        btn = e.target;
        key = btn.dataset['key'];
    }

    if (btn) {
        btn.classList.toggle('pressed');

        // What kind of button was pressed?
        if (key == 'Enter') {
            handleEquals();
        }
        else if (key == 'Backspace') {
            handleBack();
        }
        else if (btn.classList.contains('btns__number')) {
            handleNumber(key);
        } 
        else if (btn.classList.contains('btns__op')) {
            handleOperator(key);
        } 
        else if (key.toUpperCase() == 'C' || btn.classList.contains('btns__clear')) {
            reset();
        }
    }

    updateDisplay();
}

function handleNumber(num) {
    if (result) {
        reset();
    }
    
    if (operator) {
        operand2 = appendCharToOperand(operand2, num);
    } 
    else {
        operand1 = appendCharToOperand(operand1, num);
    }
}

function appendCharToOperand(operand, char) {
    if (char == '.' && hasDecimal(operand)) {
        return operand;
    }
    else if (char == '0' && operand == '0') {
        return operand;
    }
    else if (operand.length >= MAX_OPERAND_DIGITS) {
        return operand;
    }
    else {
        operand += char;
        if (operand === '.') {
            operand = '0.';
        }
        
        return operand;
    }
}

function handleOperator(op) {
    if (result) {
        let saveResult = result;
        reset();
        
        operand1 = saveResult;
    }
    else if (operand1 && operator && operand2) {
        handleEquals();
        operand1 = result;
        operand2 = '';
        result = null;
    }
    else if (!operand1 || operator) {
        // operand1 not entered, or operator already entered.
        return;
    }

    operator = op;
}

function handleEquals() {
    if (operand1 && operator && operand2) {
        result = operate(operator, parseFloat(operand1), parseFloat(operand2)).toString();
    }
}

function handleBack(e) {
    // Determine what has been entered so far 
    // and remove the most recent entry.
    if (operand2) {
        operand2 = backspace(operand2);

    } else if (operator) {
        operator = null;

    } else if (operand1) {
        operand1 = backspace(operand1);

    } else {
        return;

    }
}

function getOperatorDisplayString(op) {
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
        return removeTrailingZeroesAfterDecimal(formatNumber(result));
    }
    
    let s = '';

    if (operand2 || operator) {
        // operand1 is complete, remove trailing zeroes and/or decimal point
        s += formatNumber(removeTrailingZeroesAfterDecimal(operand1));

        if (operator) {
            s += getOperatorDisplayString(operator);

            if (operand2) {
                s += formatNumber(operand2);
            }
        }
    } 
    else if (operand1) {
        s += formatNumber(operand1);
    }

    if (!s) s = '0';

    return s;
}

function updateDisplay() {
    document.querySelector('.display__output').textContent = getDisplayString();
}

function formatNumber(s) {
    const numberParts = s.split('.');

    s = numberParts[0]; // get the integer portion of the number
    s = parseFloat(s).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: MAX_OPERAND_DIGITS });
    
    if (numberParts.length > 1) {
        // add the decimal portion of the number
        s += '.' + numberParts[1];
    }

    return s;
}

function removeTrailingZeroesAfterDecimal(s) {
    if (hasDecimal(s)) {
        while (s.endsWith('0') || s.endsWith('.')) {
            s = s.slice(0, s.length - 1);

            if (!hasDecimal(s)) {
                // Decimal has been removed, stop removing zeroes.
                break;
            }
        }
    }

    return s;
}
