import json
from pprint import pprint

class PSX:
    def __init__(_):
        _.Name2Socks = {}
        _.Sock2Names = {}
    def _UNS(_,name,ws):
        _.Name2Socks[name].remove(ws)
        if  not _.Name2Socks[name]:
            del _.Name2Socks[name]
    def UNS(_,name,ws):
        _.UNS(name,ws)
        _.Sock2Names[hex(id(ws))].remove(name)
    def SUB(_,name,ws):
        _.Sock2Names.setdefault(hex(id(ws)),[]).append(name)
        _.Name2Socks.setdefault(name,       []).append(ws)
    def PUB(_,name,data):
        for ws in _.Name2Socks[name]:
            print "DATA", (json.dumps(data))
            ws.send(json.dumps(dict(method='pub',params=data)))
    def CLS(_,ws):
        for name in _.Sock2Names.pop( hex(id(ws)) ):
            _._UNS(name,ws)

psx=PSX()

class PubSubMixin:
    def h_pub(_,channel,data):
        print "H_PUB", repr((channel,data))
        psx.PUB(channel,data)
        return dict( method='pub', result=None )
    def h_close(_):  psx.CLS(_.ws)
    def h_sub(_,add=[],dlt=[]):
        for name in add: psx.SUB(name,_.ws)
        for name in dlt: psx.UNS(name,_.ws)
        return dict( method='sub', result=None )

