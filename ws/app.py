from bottle import request, Bottle, abort, static_file
from geventwebsocket import WebSocketError
import os,sys,traceback as tb,gevent

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

    print 100
    gevent.sleep(1.2)
    print 200
    
    while True:
        try:
            message = wsock.receive()
            print 300
            gevent.sleep(1.2)
            print 400
            wsock.send("Your message was: %r" % message)
        except WebSocketError, e:
            print 500, "ERR", e
            break
