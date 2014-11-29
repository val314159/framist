import json
from collections import defaultdict
class PubSubMixin:
    ch=defaultdict(dict)
    def pub(_,channel,data):
        ch=_.ch[channel]
        msg=dict( method='pub', params=dict(channel=channel,data=data))
        for k,v in ch.iteritems(): v.ws.send(json.dumps(msg))
        return _
    def h_pub(_,channel,data):
        _.pub(channel,data)
        return dict( method='pub', result=None )
    def h_close(_):
        for ch,v in _.ch.iteritems():
            if v is _:
                d=dict(method='unsubscribe',params=[ch,'close'])
                _.pub('.'+ch,d).pub('.',d)
                del _.ch[ch][_]
    def h_sub(_,add,dlt):
        for ch in add:
            _.ch[ch][_] = _;  d=dict(method='subscribe',params=[ch])
            _.pub('.'+ch,d).pub('.',d)
        for ch in dlt:
            del _.ch[ch][_] ; d=dict(method='unsubscribe',params=[ch])
            _.pub('.'+ch,d).pub('.',d)
        return dict( method='sub', result=None )
