from flask import Flask, render_template

app = Flask("EventProtocol")
app.config.from_object('config')

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host = '0.0.0.0',
            debug = app.config['DEBUG'])
