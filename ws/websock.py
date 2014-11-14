import os,sys,traceback as tb,gevent,bottle
from bottle import request
from geventwebsocket import WebSocketError
from app import app

@app.route('/websocket')
def handle_websocket():
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        return bottle.abort(400, 'Expected WebSocket request.')

    print 100
    gevent.sleep(1.2)
    print 200
    
    while True:
        try:
            message = wsock.receive()
            print 300
            gevent.sleep(1.2)
            print 400
            wsock.send('{"q":[1,"Your message was: %r" % message]}')
        except WebSocketError, e:
            print 500, "ERR", e
            break
