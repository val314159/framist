import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError

class WebUser:
    def __init__(_,at,wsock):
        _.at=at
        _.wsock=wsock
        pass
    def run(_):
        while True:
            try:
                message = _.wsock.receive()

                print "GOT", message

                gevent.sleep(1.2)
                d = {"ping":{"input":message}}
                _.wsock.send(json.dumps(d))
            except WebSocketError, e:
                print 600, "ERR", e
                break
    pass
