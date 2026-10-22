# Rajini++ Calculator

A small browser calculator. HTML/CSS provide the interface, JavaScript handles button interaction, Flask provides an API, and the Rajini++ interpreter evaluates the arithmetic expression.

## Requirements
- Python 3.8–3.10 (the published `rajinipp` package declares support for Python versions below 3.11)
- pip

## Setup (Windows PowerShell)

```powershell
py -3.10 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.

If `py -3.10` is unavailable, install Python 3.10 first. The Rajini++ package is an older hobby project; this demo uses its experimental Python runner API.

## How the calculation works
The browser sends two numbers and an operator to `/calculate`. Flask validates the input and calls `RppRunner.eval()` with an expression such as `12.0 * 3.0;`. The returned Rajini++ result is sent back to the browser.

Do not expose this demo endpoint publicly without adding production security and request limits.
