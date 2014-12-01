import json, traceback as tb
from gevent import spawn
class BaseApp:
    def __init__(_,ws,at=''):
        _.ws=ws
        intro=open('intro.txt').read()
        _.DS().Put('intro',json.dumps(['intro',intro]))
    def step(_):
        message = _.ws.receive()
        #print "xMESSAGE", message
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
        print "##### START  NEWC #####"        
        print "##### FINISH NEWC #####"
        while 1:
            try:
                #_.who()
                r=_.step()
                #if _.step(): break
                #_.who()
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
        #_.who()
        print "##### FINISH CLOSE2 #####"
