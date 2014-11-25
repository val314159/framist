def DB(__=[]):
    if not __:
        import leveldb
        __.append( leveldb.LevelDB('.ds') )
        pass
    return __[0]

class DatastoreSvc:
    def __init__(_): _.Users={}
    def WebUser(svc):
        class DatastoreUser:
            def connect(_):
                print "DATASTORE CONNECT"
                return
                _.wu.send( dict(method='hello',params=dict(channels=[])) )
                return
                return dict(method='hello',params=dict(channels=[]))
            def h_set(_,d):
                print "DATASTORE H_SET", d, id(_.wu)
                p=d['params']
                DB().Put(p['key'],p['val'])
                _.wu.send( dict(method='set',params=dict(key=p['key'])))
                pass
            def h_get(_,d):
                print "DATASTORE H_GET", d
                key=d['params']['key']
                db=list(DB().RangeIter(key))
                try   : result=DB().Get(key)
                except: result=None
                _.wu.send( dict(method='get',params=dict(key=key,result=result)))
                return
            def h_range(_,d):
                print "DATASTORE H_RANGE",d
                key =d['params'].get('key')
                keyn=d['params'].get('keyn')
                limit=int(d['params'].get('limit','4'))
                rs=list(DB().RangeIter(key,keyn))
                rs=rs[:limit]
                _.wu.send( dict(method='range',params=dict(key=key,keyn=keyn,resultset=rs)))
                return
            def not_found(_,d):
                print "CHAT NOT FOUND", d, id(_.wu)
                pass
            pass
        return DatastoreUser()
    pass
