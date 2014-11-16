import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError

decode = json.loads
encode = json.dumps

class WebUser:
    G = {}
    def __init__(_,at,wsock): _.at=at ; _.wsock=wsock
    def myid(_): return id(_.wsock)

    def __repr__(_): return encode(_.dict())

    def dict(_):
        return dict(
            name   = _.name,
            channel= _.channel,
            )
    def dict2(_):
        return dict(
            at=_.at,
            wsock=_.wsock,
            name   = _.name,
            channel= _.channel,
            )

    def send(_, d, ch=None):
        for k,v in _.G.iteritems():
            print "G", repr((k,v.dict2()))
            if ch is None   or   v.channel==ch:
                v.wsock.send( encode(d) )
                pass
            pass
        pass
    
    def handle(_, message):
        print "HANDLE message ", repr(message)
        msg = decode(message)
        print "HANDLE msg ", repr(msg)

        class Chat:
            @staticmethod
            def connect(name,channel):
                print "XX CONNECT5", name, channel
                _.name = name ; _.channel = channel
                d = {"connect":{"input":msg,"id":_.myid()}}
                _.send(d)
                pass
            @staticmethod
            def name(name):
                _.name = name
                print "XX @ NAME", name
                d = {"name":{"input":msg,"id":_.myid()}}
                _.wsock.send(encode(d))
                pass
            @staticmethod
            def channel(channel):
                print "XX @ CHANNEL", channel
                _.channel = channel
                d = {"channel":{"input":msg,"id":_.myid()}}
                _.wsock.send(encode(d))
                pass
            @staticmethod
            def say(msg):
                print "XX @ SAY", msg
                d = {"say":{"input":msg,"id":_.myid()}}
                _.send(d,_.channel)
                pass
            @staticmethod
            def yell(msg):
                print "XX @ YELL", msg
                d = {"yell":{"input":msg,"id":_.myid()}}
                _.send(d)
                pass
            @staticmethod
            def sys(data,channel=None):
                print "XX @ SYS", data
                d = {"sys":data}
                _.send(d,channel)
                pass
            @staticmethod
            def disconnect(data):
                print "XX @ DISCONNECT", data
                d = {"disconnect":data,"id":_.myid()}
                _.send(d)
                pass
            @staticmethod
            def whoList(*a):
                print "XX @ WHO_LIST", a
                print "G", _.G
                it = ((k,v.dict()) for k,v in _.G.iteritems())
                d = {"whoList":{"input":msg,"resultMap":dict(it)}}
                _.wsock.send(encode(d))
                pass

            pass

        class PingPong:
            @staticmethod
            def ping():
                print "XX @@ PING"
                d = {"ping":{"input":msg,"result":"pong"}}
                _.wsock.send(encode(d))
                gevent.sleep(1.2)
                print "XX @@ PONG"
                d = {"pong":{"input":msg}}
                _.wsock.send(encode(d))
                pass
            pass
        
        class DataStore:
            @staticmethod
            def DB(__=[]):
                print "XX @@ DB"
                if not __:
                    import leveldb
                    __.append( leveldb.LevelDB('.ds') )
                    pass
                return __[0]
            @classmethod
            def put(cls,k,v):
                print "XX @@ PUT", k, v
                cls.DB().Put(k,v)
                d=dict(input=msg,result=k)
                _.wsock.send(encode({'put':d}))
                pass
            @classmethod
            def get(cls,k):
                print "XX @@ GET", k
                try:
                    d=dict(input=msg,result=cls.DB().Get(k))
                except KeyError:
                    d=dict(success=False,errmsg='Not Found.')
                    pass
                _.wsock.send(encode({'get':d}))
                pass
            @classmethod
            def rng(cls,k0,kn='~~~~~~',limit=10):
                print "XX @@ RNG", k0,kn,limit
                arr = []
                for n,rec in enumerate(cls.DB().RangeIter(k0,kn)):
                    if n > limit:
                        break
                    arr.append( rec )
                    pass
                _.wsock.send(encode(dict(results=arr)))
                pass
            pass
            @classmethod
            def dlt(cls,k0,kn=None):
                if kn is None: kn=k0
                print "XX @@ DLT", k0,kn
                arr = []
                for n,(k,v) in enumerate(cls.DB().RangeIter(k0,kn)):
                    cls.DB().Delete(k)
                    arr.append(k)
                    pass
                _.wsock.send(encode(dict(results=arr)))
                pass
            pass
        
        namespace = dict(
            chat = Chat,
            pingpong = PingPong,
            ds = DataStore,
            )

        ret = getattr(namespace[msg[1]],msg[2])(*msg[3])
        print "RET", ret
        pass

    def run(_):
        print "CONNECT", _.at, _.myid(), _.wsock
        try:
            _.G[_.myid()] = _
            d = {"hello":{"myid":_.myid()}}
            _.wsock.send(encode(d))
            while True:
                message = _.wsock.receive()
                if not message:
                    print "NOT MSG", repr(message)
                    break
                #gevent.sleep(0.05)
                _.handle(message)
        except WebSocketError, e:
            print 600, "ERR", e
	finally:
            print "CLOSE--", _.at, _.myid(), _.wsock
            _.close()
            del _.G[_.myid()]
            pass
        pass

    def close(_):
        try:    _.wsock.close()
        except: pass
        pass
    pass # end class WebUser
