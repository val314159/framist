import json, traceback as tb
from gevent import spawn
class BaseApp:
    def __init__(_,ws,at=''):
        _.ws=ws
        intro=open('intro.txt').read()
        _.DS().Put('intro',json.dumps(['intro',intro]))
    def step(_):
        message = _.ws.receive()
        if not message:
            return True
        msg = json.loads(message)
        params = msg['params']
        fn = getattr(_,'h_'+msg['method'])
        if   type(params)==type([]): ret = fn( *params)
        elif type(params)==type({}): ret = fn(**params)
        else: raise "HELL"
        if 'id' in msg: ret['id']=msg['id']
        _.ws.send(json.dumps(ret))
    def run(_):
        print "##### OPEN NEW CONNECTION #####"
        while 1:
            try:
                r=_.step()
                if r: break
            except:
                print "##### START  PROBLEM #####"
                tb.print_exc()
                print "##### FINISH PROBLEM #####"
                pass
            pass
        print "##### START  CLOSE #####"
        _.h_close()
        print "##### FINISH CLOSE #####"
