import os,sys,traceback as tb,gevent,bottle,json
from bottle import request
from geventwebsocket import WebSocketError
from app import app

#############################
from webutil import *
from auth import *
#############################

@app.route('/login')
def r_login():
    print "RRR /login"
    dump()
    i = A.LOGIN()
    if i:
        return i
    raise bottle.abort(499, errmsg("Access Denied."))

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
