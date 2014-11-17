import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError
decode = json.loads ; encode = json.dumps
class Chat:
    @staticmethod
    def connect(wu,name,channel):
        print "XX CONNECT5", name, channel
        wu.name = name ; wu.channel = channel
        d = {"connect":{"id":wu.myid()}}
        wu.send(d)
        pass
    @staticmethod
    def name(wu,name):
        print "XX @ NAME", name
        old_name = wu.name ; wu.name = name
        d = {"name":{"id":wu.myid(),"name":name,
                     "oldName":old_name}}
        wu.wsend(d)
        pass
    @staticmethod
    def channel(wu,channel):
        print "XX @ CHANNEL", channel
        old_channel = wu.channel ; wu.channel = channel
        d = {"channel":{"channel":channel,"id":wu.myid(),
                        "oldChannel":old_channel}}
        wu.wsend(d)
        pass
    @staticmethod
    def say(wu,msg):
        print "XX @ SAY", msg
        d = {"say":{"id":wu.myid(),"msg",msg}}
        wu.csend(d)
        pass
    @staticmethod
    def yell(wu,msg):
        print "XX @ YELL", msg
        d = {"yell":{"id":wu.myid(),"msg":msg}}
        wu.send(d)
        pass
    @staticmethod
    def whisper(wu,to,msg):
        print "XX @ WHISPER", to, msg
        d = {"whisper":{"id":wu.myid(),"msg":msg,"to":to}}
        wu.send(d)
        pass
    @staticmethod
    def sys(wu,data,channel=None):
        print "XX @ SYS", data
        d = {"sys":data}
        wu.send(d,channel)
        pass
    @staticmethod
    def disconnect(wu,data):
        print "XX @ DISCONNECT", data
        d = {"disconnect":data,"id":wu.myid()}
        wu.send(d)
        pass
    @staticmethod
    def whoList(wu,*a):
        print "XX @ WHO_LIST", a
        print "G", wu.G
        it = ((k,v.dict()) for k,v in wu.G.iteritems())
        d = {"whoList":{"resultMap":dict(it)}}
        wu.wsend(d)
        pass
