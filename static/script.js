const display = document.getElementById("display");
const expression = document.getElementById("expression");
const engine = document.getElementById("engine");

let current = "0";
let previous = null;
let operator = null;
let waitingForNext = false;

function render() {
  display.textContent = current;
  expression.textContent = previous !== null && operator
    ? `${previous} ${operator} ${waitingForNext ? "" : current}`.trim()
    : "Ready for the next move";
}

function enterNumber(value) {
  if (waitingForNext) { current = value; waitingForNext = false; }
  else current = current === "0" ? value : current + value;
  render();
}

function chooseOperator(nextOperator) {
  if (previous !== null && operator && !waitingForNext) calculate();
  previous = current;
  operator = nextOperator;
  waitingForNext = true;
  render();
}

async function calculate() {
  if (previous === null || !operator || waitingForNext) return;
  engine.textContent = "RAJINI++ IS THINKING…";
  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: previous, b: current, operator })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Calculation failed");
    current = String(data.result);
    expression.textContent = `${previous} ${operator} ${document.getElementById("display").textContent} =`;
    previous = null;
    operator = null;
    waitingForNext = true;
    display.textContent = current;
    engine.textContent = "POWERED BY RAJINI++";
  } catch (error) {
    engine.textContent = error.message;
  }
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) enterNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);

  if (button.dataset.action === "clear") {
    current = "0"; previous = null; operator = null; waitingForNext = false;
    engine.textContent = "POWERED BY RAJINI++"; render();
  }
  if (button.dataset.action === "delete") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    render();
  }
  if (button.dataset.action === "decimal" && !current.includes(".")) {
    current += "."; render();
  }
  if (button.dataset.action === "equals") calculate();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) enterNumber(event.key);
  else if (["+", "-", "*", "/", "%"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Backspace") {
    current = current.length > 1 ? current.slice(0, -1) : "0"; render();
  } else if (event.key === "Escape") {
    current = "0"; previous = null; operator = null; waitingForNext = false; render();
  }
});
