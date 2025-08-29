const display = document.getElementById("display");
let openParenNext = true;
let justCalculated = false;

function appendToDisplay(value) {
    const operators = ['+', '-', '*', '/', '.'];
    const lastChar = display.textContent.slice(-1);

    // Reset if "=" was pressed
    if (justCalculated) {
        if (!isNaN(value) || value === "(") {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
        justCalculated = false;
        return;
    }

    // Replace initial "0" correctly
    if (display.textContent === "0") {
        if (!isNaN(value) || value === ".") {
            display.textContent = value;
        } else if (operators.includes(value)) {
            display.textContent = "0" + value;  // allow 0+4, 0/4 etc.
        } else {
            display.textContent = value; // "(" replaces "0"
        }
        return;
    }

    // Prevent consecutive operators
    if (operators.includes(value) && operators.includes(lastChar)) {
        display.textContent = display.textContent.slice(0, -1) + value;
    } else {
        display.textContent += value;
    }

    adjustFontSize();
}

function clearDisplay() {
    display.textContent = "0";
    justCalculated = false;
    adjustFontSize();
}

function deleteLast() {
    if (display.textContent.length === 1 || display.textContent === "Error") {
        display.textContent = "0";
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
    adjustFontSize();
}

function calculateResult() {
    try {
        let expression = display.textContent.replace(/÷/g, "/").replace(/×/g, "*");
        let result = eval(expression);
        if (result === Infinity || isNaN(result)) throw Error();
        display.textContent = result;
        justCalculated = true;
    } catch {
        display.textContent = "Error";
    }
    adjustFontSize();
}

function insertParen() {
    appendToDisplay(openParenNext ? "(" : ")");
    openParenNext = !openParenNext;
}

function adjustFontSize() {
    const maxLength = 12;
    display.style.fontSize = (display.textContent.length > maxLength) ? "20px" : "28px";
}

// ✅ Keyboard input
document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || e.key === ".") {
        appendToDisplay(e.key);
    } else if (["+", "-", "*", "/"].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculateResult();
    } else if (e.key.toLowerCase() === "c") {
        clearDisplay();
    } else if (e.key === "Backspace") {
        deleteLast();
    } else if (e.key === "(" || e.key === ")") {
        appendToDisplay(e.key);
    }
});
