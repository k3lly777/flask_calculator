from flask import Flask, render_template, request

app = Flask(__name__)

history = []

@app.route("/", methods=["GET", "POST"])
def index():
    result = ""
    expression = ""
    if request.method == "POST":
        expression = request.form.get("expression", "")
        try:
            # Convert symbols for Python eval
            expr = expression.replace("×", "*").replace("÷", "/").replace("^", "**").replace("mod", "%")
            result = str(eval(expr))
            history.append(f"{expression} = {result}")
            if len(history) > 20:  # Keep last 20 entries
                history.pop(0)
        except Exception:
            result = "Error"
    return render_template("index.html", result=result, expression=expression, history=history)

if __name__ == "__main__":
    import os
    # Render sets PORT dynamically; default to 5000 for local testing
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

