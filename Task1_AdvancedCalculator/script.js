const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let expression = "";
let lastAnswer = 0;

function updateDisplay() {
  display.textContent = expression || "0";
}

function factorial(n) {
  if (n < 0) return NaN;
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function evaluate() {
  try {
    let expr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, "Math.PI")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/x²/g, "**2")
      .replace(/x³/g, "**3")
      .replace(/x⁻¹/g, "1/(")
      .replace(/x10\^/g, "*10**")
      .replace(/Ans/g, lastAnswer)
      .replace(/log/g, "Math.log10")
      .replace(/ln/g, "Math.log")
      .replace(/exp/g, "Math.exp")
      .replace(/mod/g, "%")
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/deg\(([^)]+)\)/g, (_, x) => `(${toDegrees(eval(x))})`)
      .replace(/rad\(([^)]+)\)/g, (_, x) => `(${toRadians(eval(x))})`)
      .replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));

    let result = eval(expr);
    lastAnswer = result;
    expression = result.toString();
    updateDisplay();
  } catch (e) {
    expression = "Error";
    updateDisplay();
  }
}

buttons.forEach((btn) => {
  const value = btn.textContent;

  btn.addEventListener("click", () => {
    switch (value) {
      case "=":
        evaluate();
        break;
      case "AC":
        expression = "";
        updateDisplay();
        break;
      case "DEL":
        expression = expression.slice(0, -1);
        updateDisplay();
        break;
      case "Ans":
        expression += "Ans";
        updateDisplay();
        break;
      case "√":
      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
      case "exp":
      case "deg":
      case "rad":
        expression += `${value}(`;
        updateDisplay();
        break;
      case "x²":
        expression += "**2";
        updateDisplay();
        break;
      case "x^":
        expression += "**";
        updateDisplay();
        break;
      case "x⁻¹":
        expression += "1/(";
        updateDisplay();
        break;
      case "x10^":
        expression += "*10**";
        updateDisplay();
        break;
      case "(-)":
        expression += "-";
        updateDisplay();
        break;
      case "n!":
        expression += "!";
        updateDisplay();
        break;
      case "mod":
        expression += "%";
        updateDisplay();
        break;
      default:
        expression += value;
        updateDisplay();
    }
  });
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
