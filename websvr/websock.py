import os,sys,traceback as tb,gevent,bottle,json
from bottle import request
from geventwebsocket import WebSocketError
from app import app

def dump():
    params  = request.params
    headers = request.headers
    print "PARAMS ", dict(params)
    print "HEADERS", dict(headers)
    pass

def errmsg(_): return json.dumps({"success":false,"errmsg":_})

def get_websocket():
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        raise bottle.abort(499, errmsg("Expected WebSocket request."))
    return wsock

#############################
from auth import *
#############################

@app.route('/login')
def r_login():
    print "RRR /login"
    dump()
    params  = request.params
    headers = request.headers
    u = params.get('u') or headers.get('u')
    p = params.get('p') or headers.get('u')
    i = login_user(u,p)
    if i:
        return i
    raise bottle.abort(499, errmsg("Access Denied."))

@app.route('/auth')
def r_auth():
    print "RRR /auth"
    dump()
    at = AUTH()
    return ['true']

@app.route('/websocket')
def r_websocket():
    print "RRR /websocket"
    dump()
    at = AUTH()

    print 100
    wsock = get_websocket()

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
