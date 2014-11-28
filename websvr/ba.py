import json
class BaseApp:
    def __init__(_,ws,at=''): _.ws=ws
    def run(_):
        _.ws.send(json.dumps(dict( method='hello',params=[1,2,3] )))
        while 1:
            message = _.ws.receive()
            print "MESSAGE", message
            if not message:
                break
            msg = json.loads(message)
            params = msg['params']
            fn = getattr(_,'h_'+msg['method'])
            from gevent import spawn
            if   type(params)==type([]): ret=spawn(fn, *params)
            elif type(params)==type({}): ret=spawn(fn,**params)
            else: raise "HELL"
            print "ZZZ, RET=", ret
            if 'id' in msg: ret['id']=msg['id']; _.ws.send(json.dumps(ret))
            pass
        _.h_close()
class App(BaseApp,PubSubMixin,DatastoreMixin): pass
