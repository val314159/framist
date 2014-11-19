import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError
decode = json.loads ; encode = json.dumps
class Chat:
    @staticmethod
    def connect(wu, sid):
        print "XX CONNECT5", sid
        wu.add_user()
        d = {"method":"connect","params":wu.dict(),"id":wu.sid()}
        wu.send(d)
        print "XX CONNECT99999", sid
        pass
    @staticmethod
    def name(wu,name):
        print "XX @ NAME", name
        old_name = wu.name ; wu.name = name
        d = {"name":{"sid":wu.sid(),"name":name,
                     "oldName":old_name}}
        wu.wsend(d)
        pass
    @staticmethod
    def channel(wu,channel):
        print "XX @ CHANNEL", channel
        old_channel = wu.channel ; wu.channel = channel
        d = {"channel":{"channel":channel,"sid":wu.sid(),
                        "oldChannel":old_channel}}
        wu.send(d)
        pass
    @staticmethod
    def say(wu,msg,channel):
        print "XX @ SAY", msg, channel
        d = {"msg":msg,"channel":channel,"from":wu.dict()}
        d = {"method":"say","params":d}
        wu.send(d,channel)
        pass
    @staticmethod
    def yell(wu,msg):
        print "XX @ YELL", msg
        d = {"yell":{"sid":wu.sid(),"msg":msg}}
        wu.send(d)
        pass
    @staticmethod
    def whisper(wu,to,msg):
        print "XX @ WHISPER", to, msg
        d = {"whisper":{"sid":wu.sid(),"msg":msg,"to":to}}
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
        d = {"disconnect":data,"sid":wu.sid()}
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
