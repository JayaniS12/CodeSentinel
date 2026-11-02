from analyzer.static_analyzer import analyze_code

sample_code = """
def calculate(x=[]):
    try:
        result = eval("10 + 20")
    except:
        pass
"""

result = analyze_code(sample_code)

print(result)