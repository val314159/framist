import json, leveldb
def pushv(a,v): a.append(v); return v
def identity(x): return x
class DatastoreMixin:
    @staticmethod
    def DS(__=[]): return(__[0] if __ else pushv(__,leveldb.LevelDB('.xdb')))
    def h_put(_,key,value,encode=json.dumps):
        _.DS().Put(key,encode(value))
        print "PUT", key, value
        return dict( method='put', result=None )
    def h_get(_,key,decode=json.loads):
        print "GET", key, _.DS().Get(key)
        try:return dict( method='get', result=decode(_.DS().Get(key)))
        except KeyError:
            return dict( method='get', error={"message":"Key Not Found"})
    def h_range(_,key='',keyn=None,decode=json.loads):
        rng = ((k,decode(v)) for k,v in _.DS().RangeIter(key0,keyn))
        return dict( method='range', result=list(rng) )
    def h_dlt(_,keys):
        return dict( method='dlt', result=len(_.DS().Delete(key) for key in keys))
    pass
