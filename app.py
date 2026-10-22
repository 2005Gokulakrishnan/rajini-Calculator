from flask import Flask, render_template, request, jsonify
from rajinipp.runner import RppRunner
import math

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/calculate")
def calculate():
    data = request.get_json(silent=True) or {}
    try:
        a = float(data["a"])
        b = float(data["b"])
        operator = data["operator"]
    except (KeyError, TypeError, ValueError):
        return jsonify(error="Enter two valid numbers."), 400

    if not math.isfinite(a) or not math.isfinite(b):
        return jsonify(error="Please enter finite numbers."), 400

    if operator not in {"+", "-", "*", "/", "%"}:
        return jsonify(error="Unsupported operation."), 400
    if operator in {"/", "%"} and b == 0:
        return jsonify(error="Cannot divide by zero."), 400

    # The arithmetic expression is evaluated by the Rajini++ interpreter.
    try:
        runner = RppRunner()
        result = runner.eval(f"{a} {operator} {b};")
        return jsonify(result=str(result))
    except Exception as exc:
        app.logger.exception("Rajini++ calculation failed")
        return jsonify(error="Rajini++ could not evaluate this expression. Check the installation."), 500

if __name__ == "__main__":
    app.run(debug=True)
