import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError

G = {}

class WebUser:
    def __init__(_,at,wsock):
        _.at=at
        _.wsock=wsock
        pass
    def myid(_):
        return id(_.wsock)
    def run(_):
        print "CONNECT", _.at, id(_.wsock), _.wsock
        while True:
            try:
                message = _.wsock.receive()
                print "GOT", repr(message)
                gevent.sleep(0.1)

                d = {"ping":{"input":message}}
                _.wsock.send(json.dumps(d))
            except WebSocketError, e:
                print 600, "ERR", e
                break
    pass
