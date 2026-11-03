# CodeSentinel 🛡️

**AI-Powered Python Code Review Assistant**

CodeSentinel is a Python code analysis tool that identifies selected code quality issues and potential security risks using static analysis, then provides an AI-generated explanation and suggestions using a locally running language model.

## ✨ Features

- **Static Code Analysis:** Checks Python code for selected issues using Python's AST module.
- **Security Checks:** Detects potentially unsafe use of `eval()` and `exec()`.
- **Bug Risk Detection:** Identifies mutable default arguments.
- **Code Quality Checks:** Detects bare `except` blocks.
- **Syntax Error Detection:** Reports Python syntax errors.
- **AI-Powered Review:** Uses a locally running Qwen model through Ollama to explain static analysis findings.
- **Issue Dashboard:** Displays total issues and severity counts.
- **Beginner-Friendly Suggestions:** Provides explanations and possible improvements.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Flask | Backend web framework |
| Python AST | Static code analysis |
| Ollama | Local AI model runtime |
| Qwen 2.5 (1.5B) | AI-powered code review |
| HTML, CSS, JavaScript | Frontend |

## 📁 Project Structure

```text
CodeSentinel/
├── app.py
├── requirements.txt
├── test_analyzer.py
├── analyzer/
│   ├── __init__.py
│   └── static_analyzer.py
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## ⚙️ Requirements

- Python 3.10 or later
- Ollama
- Qwen 2.5 (1.5B) model
- A modern web browser

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/JayaniS12/CodeSentinel.git
cd CodeSentinel
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows Command Prompt:

```bash
venv\Scripts\activate.bat
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Install and prepare Ollama

Install Ollama from:

https://ollama.com/

Download the model:

```bash
ollama pull qwen2.5:1.5b
```

Make sure Ollama is running before requesting an AI review.

### 5. Run CodeSentinel

```bash
python app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000/
```

## 🧪 Running Tests

Run the static analyzer tests using:

```bash
python test_analyzer.py
```

## 🔍 How It Works

1. The user enters Python code in the CodeSentinel interface.
2. The Flask backend receives the submitted code.
3. The static analyzer checks the code for supported issue patterns.
4. The results are displayed in the review dashboard.
5. When AI Review is requested, the findings are sent as context to the local Qwen model through Ollama.
6. The AI generates explanations and improvement suggestions based on the static analysis results.

## ⚠️ Limitations

- The current static analyzer checks only a limited set of predefined patterns.
- It does not detect every possible bug, vulnerability, or code quality issue.
- AI-generated suggestions may not always be correct and should be reviewed.
- A clean report means no issues were found by the implemented checks; it does not guarantee that the code is completely error-free.
- AI review requires Ollama and the Qwen model to be running locally.

## 👩‍💻 Project

**CodeSentinel** — Built for Neural Storm 2026.

GitHub Repository: https://github.com/JayaniS12/CodeSentinel
