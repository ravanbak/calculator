const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(op, a, b) {
    let f;
    
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