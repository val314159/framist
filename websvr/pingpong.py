import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError

decode = json.loads
encode = json.dumps

class PingPong:
    def __init__(_,name):_.name=name
    def ping(_,wu,msg):
        print "XX @@ PING"
        d = {"ping":{"input":msg,"result":"pong"}}
        wu.wsock.send(encode(d))
        gevent.sleep(1.2)
        print "XX @@ PONG"
        d = {"pong":{"input":msg}}
        wu.wsock.send(encode(dict(
                    method="pong",
                    ns=_.name,
                    params=dict(
                        input=msg
                        ))))
        pass
    pass
