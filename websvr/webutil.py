import os,sys,traceback as tb,gevent,bottle,json
from bottle import request
from geventwebsocket import WebSocketError

def dump():
    params  = request.params
    headers = request.headers
    print "PARAMS ", dict(params)
    print "HEADERS", dict(headers)
    pass

def errmsg(_): return json.dumps({"success":False,"errmsg":_})

def launch():
    from app import app
    from gevent.pywsgi import WSGIServer
    from geventwebsocket.handler import WebSocketHandler
    server = WSGIServer(("0.0.0.0", 8080), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()

def get_websocket():
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        raise bottle.abort(499, errmsg("Expected WebSocket request."))
    return wsock
