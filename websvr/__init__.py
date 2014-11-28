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
    def pub(_,channel,data):
        ch=_.ch[channel]
        msg=dict( method='pub', params=dict(
                channel=channel,data=data))
        for k,v in ch.iteritems(): _.ws.send(json.dumps(msg))
        return _
    def h_pub(_,channel,data):
        _.pub(channel,data)
        return dict( method='pub', result=None )
    def h_sub(_,add,dlt):
        for ch in add:
            _.ch[ch][_] = _
            d=dict(method='subscribe',params=[ch])
            _.pub('.'+ch,d).pub('.',d)
            pass
        for ch in dlt:
            del _.ch[ch][_]
            d=dict(method='unsubscribe',params=[ch])
            _.pub('.'+ch,d).pub('.',d)
            pass
        return dict( method='sub', result=None )
    pass
def pushv(a,v): a.append(v); return v
def identity(x): return x
class DatastoreMixin:
    @staticmethod
    def DS(__=[]): return(__[0] if __ else pushv(__,LevelDB('.xdb')))
    def h_rput(_,key,value,encode=identity):
        _.DS().Put(key,encode(value))
        return dict( method='put', result=None )
    def h_rget(_,key,decode=identity):
        try:return dict( method='get', result=decode(_.DS().Get(key)))
        except KeyError:
            return dict( method='get', error={"message":"Key Not Found"})
    def h_rrange(_,key='',keyn=None,decode=identity):
        rng = ((k,decode(v)) for k,v in _.DS().RangeIter(key0,keyn))
        return dict( method='range', result=list(rng) )
    def h_dlt(_,keys):
        for key in keys: _.DS().Delete(key)
        return dict( method='dlt', result=None )
    def h_put  (_,key,value):        return _.h_rput  (key,value,json.dumps)
    def h_get  (_,key):              return _.h_rget  (key,      json.loads)
    def h_range(_,key='',keyn=None): return _.h_rrange(key,keyn, json.loads)
    pass
class App(PubSubMixin,DatastoreMixin):
    def __init__(_,ws,at=''): _.ws=ws
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
            from gevent import spawn
            if   type(params)==type([]): ret=spawn(fn, *params)
            elif type(params)==type({}): ret=spawn(fn,**params)
            else: raise "HELL"
            print "ZZZ, RET=", ret
            if 'id' in msg: ret['id']=msg['id']; _.ws.send(json.dumps(ret))
@app.route('/websock2')
def r_websocket2(): App(WEB_SOCKET(),AUTH()).run()

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
