class PubSubSvc:
    def __init__(_):
        _.Users={}
        _.channels = {}
        pass
    def disconnect(_,*a,**kw):
        print ">> PUBSUB DISCONNECT", repr((a,kw))
        return
    def WebUser(svc):
        class PubSubUser:
            def connect(_):
                print ">> PUBSUB CONNECT"
                return
            def h_sub(_,d):
                print "PUBSUB H_SUB", d
                return
                p=d['params']
                DB().Put(p['key'],p['val'])
                _.wu.send( dict(method='set',params=dict(key=p['key'])))
                pass
            def h_pub(_,d):
                print "PUBSUB H_PUB", d
                return
                key=d['params']['key']
                db=list(DB().RangeIter(key))
                try   : result=DB().Get(key)
                except: result=None
                _.wu.send(dict(method='get',params=dict(key=key,result=result)))
                return
            def not_found(_,d):
                print "PUBSUB NOT FOUND", d, id(_.wu)
                pass
            pass
        return PubSubUser()
    pass
