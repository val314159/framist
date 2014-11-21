import os,sys,traceback as tb,gevent,bottle,json
from geventwebsocket import WebSocketError

decode = json.loads
encode = json.dumps

class DataStore:
    def __init__(_,name):_.name=name
    @staticmethod
    def DB(__=[]):
        print "XX @@ DB"
        if not __:
            import leveldb
            __.append( leveldb.LevelDB('.ds') )
            pass
        return __[0]
    @classmethod
    def put(wu,cls,k,v):
        print "XX @@ PUT", k, v
        cls.DB().Put(k,v)
        d=dict(input=msg,result=k)
        wu.wsock.send(encode({'put':d}))
        pass
    @classmethod
    def get(wu,cls,k):
        print "XX @@ GET", k
        try:
            d=dict(input=msg,result=cls.DB().Get(k))
        except KeyError:
            d=dict(success=False,errmsg='Not Found.')
            pass
        wu.wsock.send(encode({'get':d}))
        pass
    @classmethod
    def rng(wu,cls,k0,kn='~~~~~~',limit=10):
        print "XX @@ RNG", k0,kn,limit
        arr = []
        for n,rec in enumerate(cls.DB().RangeIter(k0,kn)):
            if n > limit:
                break
            arr.append( rec )
            pass
        wu.wsock.send(encode(dict(results=arr)))
        pass
    @classmethod
    def dlt(wu,cls,k0,kn=None):
        if kn is None: kn=k0
        print "XX @@ DLT", k0,kn
        arr = []
        for n,(k,v) in enumerate(cls.DB().RangeIter(k0,kn)):
            cls.DB().Delete(k)
            arr.append(k)
            pass
        wu.wsock.send(encode(dict(results=arr)))
        pass
    pass
