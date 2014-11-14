from bottle import request, Bottle, abort, static_file
from geventwebsocket import WebSocketError

app = Bottle()

@app.route('/')
def index():
    return static_file('index.html', root='./static')

@app.route('/js/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/js')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')


@app.route('/websocket')
def handle_websocket():
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        return abort(400, 'Expected WebSocket request.')
    
    while True:
        try:
            message = wsock.receive()
            wsock.send("Your message was: %r" % message)
        except WebSocketError:
            break
    
