from bottle import Bottle, static_file
import json

class WebSocketServices:
    def __init__(_):
        _.svc = {}
        _.users={}
        pass
    def addSvc(_,svc,name):
        # do some dependency injection
        svc.name = name       
        svc.wss = _
        _.svc[name] = svc
        return _
    def WebUser(wss,at,ws):
        class WebSocketUser:
            def __init__(_): _.ns={}
            def _dispatch(_,d,name=None,pfx='h_'):
                if name is None: name=d['ns']
                user = _.ns[name]
                try: f=getattr(user,pfx+d['method'])
                except:
                    try: f=user.not_found
                    except:
                        print "ERRANT PACKET", name
                        f = None
                        pass
                    pass
                if f:
                    ret = f(d)
                    if ret:
                        print "RETURN", ret, name, ws
                        d2=dict(ns=name,method=d['method'],params=ret)
                        print "D2", d2
                        ws.send(json.dumps(d2))
                        pass
                    pass
                pass
            def sid(_): return 's%d'%id(_)
            def run(_):
                print "TIME TO RUN THIS THING"
                while 1:
                    z = ws.receive()
                    d = json.loads(z)
                    name = d.get('ns')
                    if not name:
                        print "NO NAMESPACE"
                        continue
                    _._dispatch(d)
                    pass
                pass
            pass
        wu = WebSocketUser()
        for name,svc in wss.svc.iteritems():
            sub_wu = svc.WebUser()
            print "SUB_WU", sub_wu
            # do some dependency injection
            sub_wu.wu = wu
            wu.ns[name] = sub_wu
            ret = sub_wu.connect()
            if ret:
                print "CONNECT RETURN", ret, name, ws
                ret['ns'] = name
                ws.send(json.dumps(ret))
                pass
            pass
        return wu
    pass
