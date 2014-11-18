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
    def __init__(_,at,wsock): _.at=at ; _.wsock=wsock
    def __repr__(_): return encode(_.dict())
    def myid(_): return 'u%s'%id(_.wsock)
    def dict(_): return dict(name=_.name,channels= _.channels)
    def dict2(_):return dict(at=_.at, wsock=_.wsock,
                             name=_.name, channels= _.channels)
    def close(_):
        try:    _.wsock.close()
        except: pass
        pass
    def wsend(_, d): _.wsock.send( encode(d) )
    def csend(_, d): _.send(d,_.channel)
    def send(_, d, ch=None):
        for k,v in _.G.iteritems():
            print "G", repr((k,v.dict2()))
            if ch is None   or   v.channel==ch:
                v.wsend(d)
                pass
            pass
        pass
    def run(_):
        print "CONNECT", _.at, _.myid(), _.wsock
        try:
            _.G[_.myid()] = _
            _.name = 'Guest'
            _.channels = ['~Basement',_.myid(),'y','s']
            _.wsend(dict(method='hello',params={'uid':_.myid()}))
            while True:
                message = _.wsock.receive()
                print "MESSAGE", repr(message)
                if not message:
                    print "NOT MESSAGE", repr(message)
                    break
                try:
                    msg = decode(message)
                    getattr(Namespace[msg[1]],msg[2])(_,*msg[3])
                except:
                    print '*'*80
                    tb.print_exc()
                    print '*'*80
                    pass
                pass
        except WebSocketError, e:
            print 600, "ERR", e
	finally:
            print "CLOSE--", _.at, _.myid(), _.wsock
            _.close()
            del _.G[_.myid()]
            pass
        pass
    pass # end class WebUser
