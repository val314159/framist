import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError
from pingpong import PingPong
from datastore import DataStore
from chat import Chat
decode = json.loads ; encode = json.dumps
Namespace = dict(chat = Chat,
                 pingpong = PingPong,
                 ds = DataStore)
class WebUser:
    G = {}
    def __init__(_,at,wsock):
        _.at=at
        _.wsock=wsock
        _.name = 'Guest'
        _.channels = ['~Basement',_.sid(),'y','s']
        pass
    def __repr__(_): return encode(_.dict())
    def sid(_): return 's%s'%id(_.wsock)
    def dict(_): return dict(name=_.name,channels= _.channels,sid=_.sid())
    def dict2(_):return dict(at=_.at, wsock=_.wsock, sid=_.sid(),
                             name=_.name, channels= _.channels)
    def close(_):
        try:    _.wsock.close()
        except: pass
        pass
    def wsend(_, d): _.wsock.send( encode(d) )
    def csend(_, d): _.send(d,_.channels[0])
    def send(_, d, ch=None):
        print "SEND (d,ch)", repr((d,ch))
        for k,v in _.G.iteritems():
            print "G", repr((k,v.dict2()))
            if not ch   or   ch in v.channels:
                print "s", v, d
                v.wsend(d)
                print "s2"
                pass
            pass
        pass
    def add_user(_): _.G[_.sid()] = _
    def del_user(_):
        _.close(); 
        if _.sid() in _.G: del _.G[_.sid()]
        pass
    def run(_):
        print "RUN", _.at, _.sid(), _.wsock
        try:
            _.wsend(dict(method='hello', params=_.dict()))
            while True:
                message = _.wsock.receive()
                print "MESSAGE", repr(message)
                if not message:
                    print "NOT MESSAGE", repr(message)
                    break
                try:
                    msg = decode(message)
                    print "MSG1", msg
                    msg['ns']
                    print "MSG2", msg
                    ns=Namespace[msg['ns']]
                    params=msg.get('params',[])
                    method=getattr(ns,msg['method'])
                    if type(params)==type([]):
                        method(_,*params)
                    elif type(params)==type({}):
                        method(_,**params)
                    else:
                        raise Exception("BAD TYPE")
                except:
                    print '*'*80
                    tb.print_exc()
                    print '*'*80
                    pass
                pass
        except WebSocketError, e:
            print 600, "ERR", e
	finally:
            print "CLOSE--", _.at, _.sid(), _.wsock
            _.del_user()
            pass
        pass
    pass # end class WebUser
