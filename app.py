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
            # Safe eval for basic operations
            expr = expression.replace("×", "*").replace("÷", "/").replace("^", "**").replace("mod", "%")
            result = str(eval(expr))
            history.append(f"{expression} = {result}")
            if len(history) > 10:
                history.pop(0)
        except Exception:
            result = "Error"
    return render_template("index.html", result=result, expression=expression, history=history)

if __name__ == "__main__":
    import os
    # Render provides the PORT environment variable
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

