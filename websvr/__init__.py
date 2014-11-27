from bottle import Bottle, static_file
import json
app = Bottle()

@app.route('/')
def index():
    return static_file('main.html', root='./static')

@app.route('/js/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/js')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')
###################################
from auth.misc import LOGIN,AUTH
from webutil import WEB_SOCKET

@app.route('/login')
def r_login():
    print "RRR /login"
    return LOGIN()

def WSS(_=[]):
    if not _:
        from websocketservices import WebSocketServices
        from chatsvc import ChatSvc
        from dssvc import DatastoreSvc
        from pssvc import PubSubSvc
        _.append( WebSocketServices()
                  .addSvc(ChatSvc(), 'chat')
                  .addSvc(DatastoreSvc(), 'ds')
                  .addSvc(PubSubSvc(), 'ps')
                  )
        pass
    return _[0]

@app.route('/ws2')
def r_websocket2():
    print "RRR /ws2"
    wu = WSS().WebUser(AUTH(),WEB_SOCKET())
    print "RRR3 /ws2..... run"
    wu.run()
    pass

from collections import defaultdict

class PubSubMixin:
    ch=defaultdict(dict)
    @classmethod
    def ps_reset(_): _.ch=defaultdict(dict)
    def h_pub(_,channel,data):
        ch=_.ch[channel]
        msg=dict( method='pub', params=dict(
                channel=channel,data=data))
        for k,v in ch.iteritems(): _.ws.send(json.dumps(msg))
        return dict( method='pub', result=None )
    def h_sub(_,add,dlt):
        for ch in add:     _.ch[ch][_]=_
        for ch in dlt: del _.ch[ch][_]
        return dict( method='sub', result=None )
    pass

class DatastoreMixin:
    def ds_reset(_): _.ds={}
    def h_put(_,key,value):
        print "H PUT", key,value
        _.ds[key]=value
        return dict( method='put', result=None )
    def h_get(_,key):
        ret = _.ds.get(key)
        print "H GET", ret
        return dict( method='get', result=ret )
    def h_range(_,key=''):
        ret=[(k,v) for k,v in _.ds.iteritems() if k>=key]
        return dict( method='range', result=ret )
    pass

class App(PubSubMixin,DatastoreMixin):
    def __init__(_,ws): _.ws=ws ; _.h_reset()
    def h_reset(_): _.ps_reset() ; _.ds_reset()
    def run(_):
        _.ws.send(json.dumps(dict( method='hello',params=[1,2,3] )))
        while 1:
            message = _.ws.receive()
            print "MESSAGE", message
            if not message:
                break
            msg = json.loads(message)
            params = msg['params']
            fn = getattr(_,'h_'+msg['method'])
            if   type(params)==type([]): ret=fn(*params)
            elif type(params)==type({}): ret=fn(**params)
            else: raise "HELL"
            print "ZZZ, RET=", ret
            if 'id' in msg:
                ret['id'] = msg['id']
                _.ws.send(json.dumps(ret))
                pass
            pass
        pass
    pass

@app.route('/websock')
def r_websocket2():
    print "RRR1 /websock"
    at,ws=AUTH(),WEB_SOCKET()
    print "RRR2 /websock", at, ws
    app = App(ws)
    app.run()
    pass

###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

def launch():
    from auth.misc import POPULATE
    POPULATE()
    server = WSGIServer(("0.0.0.0", 8080), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
