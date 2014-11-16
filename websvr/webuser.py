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
    
    def handle(_, message):
        print "HANDLE message ", repr(message)
        msg = decode(message)
        print "HANDLE msg ", repr(msg)

        class Chat:
            @staticmethod
            def connect(name,channel):
                print "XX CONNECT5", name, channel
                _.name = name
                _.channel = channel
                pass
            @staticmethod
            def name(name):
                _.name = name
                print "XX NAME", name
                pass
            @staticmethod
            def channel(channel):
                print "XX CHANNEL", channel
                _.channel = channel
                pass
            @staticmethod
            def message(msg):
                print "XX MESSAGE", msg
                pass
            @staticmethod
            def whoList(*a):
                print "XX WHOLIST", a
                print "G", _.G
                g = {}
                for k,v in _.G.iteritems():
                    print "ggggg", repr((k,v))
                    vv = _.dict()
                    print "vvvvv", repr((vv,))
                    g[k] = vv
                    pass
                d = {"whoList":{"input":msg,"resultSet":g}}
                _.wsock.send(encode(d))
                pass
            pass

        class PingPong:
            @staticmethod
            def ping():
                print "XX PING"
                d = {"ping":{"input":msg}}
                _.wsock.send(encode(d))
                pass
            pass
        
        namespace = dict(
            chat = Chat,
            )

        ret = getattr(namespace[msg[1]],msg[2])(*msg[3])
        print "RET", ret

        #d = {"ping":{"input":message}}
        #_.wsock.send(encode(d))
        pass

    def run(_):
        print "CONNECT", _.at, _.myid(), _.wsock
        try:
            _.G[_.myid()] = _
            while True:
                message = _.wsock.receive()
                if not message:
                    print "NOT MSG", repr(message)
                    break
                gevent.sleep(0.05)
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
