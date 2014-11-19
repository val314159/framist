import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError
decode = json.loads ; encode = json.dumps
class Chat:
    @staticmethod
    def connect(wu, sid):
        print "XX CONNECT5", sid
        wu.add_user()
        wu.send({"method":"connect",
                 "params":wu.dict(),"id":wu.sid()})
        print "XX CONNECT99999", sid
        pass
    @staticmethod
    def name(wu,name):
        print "XX @ NAME", name
        old_name = wu.name ; wu.name = name
        wu.send({"method":"name",
                 "params":{"from":wu.dict()
                           "oldName":old_name}})
        pass
    @staticmethod
    def channel(wu,channel):
        print "XX @ CHANNEL", channel
        old_channel = wu.channel ; wu.channel = channel
        wu.send({"method":"channel",
                 "params":{"from":wu.dict()
                           "oldChannel":old_channel}})
        pass
    @staticmethod
    def say(wu,msg,channel):
        print "XX @ SAY", msg, channel
        d = {"msg":msg,"channel":channel,"from":wu.dict()}
        wu.send({"method":"say","params":d},channel)
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
