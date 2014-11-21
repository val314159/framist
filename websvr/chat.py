import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError
decode = json.loads ; encode = json.dumps
class Chat:
    def __init__(_,name):_.name=name
    def connect(_,wu):
        print "XX CONNECT5", wu
        channels = ['~Basement',wu.sid(),'nGuest','y','s','*']
        locals = wu.locals[_.name] = {}
        locals['channels'] = channels
        wu.add_user()
        wu.send({"method":"connect","ns":_.name,
                 "params":wu.dict(),"id":wu.sid()})
        print "XX CONNECT99999", wu
        pass
    def name(_,wu,name):
        print "XX @ NAME", name
        old_name = wu.name ; wu.name = name
        wu.send({"method":"name","ns":_.name,
                 "params":{"from":wu.dict1(),
                           "oldName":old_name}})
        pass
    def channel(_,wu,channel):
        print "XX @ CHANNEL", channel
        old_channel = wu.channel ; wu.channel = channel
        wu.send({"method":"channel","ns":_.name,
                 "params":{"from":wu.dict1(),
                           "oldChannel":old_channel}})
        pass
    def say(_,wu,msg,channel):
        print "XX @ SAY", msg, channel
        d = {"msg":msg,"channel":channel,"from":wu.dict1()}
        wu.send({"method":"say","params":d,"ns":_.name},channel)
        pass
    def quit(_,wu,data):
        print "XX @ QUIT", data
        wu.send({"method":"quit","ns":_.name,
                 "params":wu.dict(),"id":wu.sid()})
        pass
    def disconnect(_,wu,data):
        print "XX @ DISCONNECT", data
        d = {"disconnect":data,"sid":wu.sid()}
        wu.send(d)
        pass
    def whoList(_,wu,pattern=''):
        print "XX @ WHO_LIST", repr(pattern)
        it = (v.dict1() for k,v in wu.G.iteritems())
        wu.wsend({"ns":_.name,"method":"whoList",
                  "params":{"whoList":list(it)}})
        pass
