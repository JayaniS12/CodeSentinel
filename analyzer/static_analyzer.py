
import ast


class CodeAnalyzer(ast.NodeVisitor):

    def __init__(self):
        self.issues = []

    def add_issue(self, line, severity, category, message, suggestion):
        self.issues.append({
            "line": line,
            "severity": severity,
            "category": category,
            "message": message,
            "suggestion": suggestion
        })

    # Detect dangerous function calls
    def visit_Call(self, node):

        if isinstance(node.func, ast.Name):

            if node.func.id == "eval":
                self.add_issue(
                    node.lineno,
                    "High",
                    "Security",
                    "Use of eval() detected.",
                    "Avoid eval(). Use safer alternatives."
                )

            elif node.func.id == "exec":
                self.add_issue(
                    node.lineno,
                    "High",
                    "Security",
                    "Use of exec() detected.",
                    "Avoid dynamically executing code."
                )

        self.generic_visit(node)

    # Detect bare except blocks
    def visit_ExceptHandler(self, node):

        if node.type is None:
            self.add_issue(
                node.lineno,
                "Medium",
                "Code Quality",
                "Bare except block detected.",
                "Catch specific exceptions instead."
            )

        self.generic_visit(node)

    # Detect mutable default arguments
    def visit_FunctionDef(self, node):

        defaults = node.args.defaults

        for default in defaults:
            if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                self.add_issue(
                    node.lineno,
                    "Medium",
                    "Bug Risk",
                    "Mutable default argument detected.",
                    "Use None as the default and create the object inside the function."
                )

        self.generic_visit(node)


def analyze_code(source_code):

    try:
        tree = ast.parse(source_code)

    except SyntaxError as error:
        return {
            "success": False,
            "issues": [{
                "line": error.lineno,
                "severity": "High",
                "category": "Syntax Error",
                "message": error.msg,
                "suggestion": "Check your Python syntax."
            }],
            "total_issues": 1
        }

    analyzer = CodeAnalyzer()
    analyzer.visit(tree)

    return {
        "success": True,
        "issues": analyzer.issues,
        "total_issues": len(analyzer.issues)
    }
