from bottle import static_file, abort, Bottle, request
import os,json
app=Bottle()
@app.route('/')
@app.route('/f')
def server_static():
  return static_file('fs/index.html', root='./static')
@app.route('/d')
def server_static():
  return static_file('fs/dir.html', root='./static')
@app.route('/ws/fs')
def r_websock():
    ws = request.environ.get('wsgi.websocket')
    if not ws: abort(499,errmsg("Expected WebSocket req."))
    print "OPENED"
    while 1:
      message=ws.receive()
      print "MESSAGE", repr(message)
      if not message:
        break
      msg=json.loads(message)
      if msg['method']=='fs_get':
        print "GETTTT", msg['params'][0]
        path = 'fs/'+msg['params'][0]
        eltName = msg['params'][1]
        from stat import S_ISDIR
        if S_ISDIR(os.stat(path).st_mode):
          print "DIR"
          #data = [(p,S_ISDIR(os.stat(p))) for p in os.listdir(path)]
          data = [(p,) for p in os.listdir(path)]
        else:
          print "FILE"
          data = open(path).read()
          pass
        ws.send(json.dumps({"result":[path,data,eltName]}))
      elif msg['method']=='fs_put':
        print "PUTTTT", msg['params'][0], msg['params'][1]
        fname = 'fs/'+msg['params'][0]
        data = msg['params'][1]
        f=open(fname,'w')
        for x in data:
          f.write(x)
          pass
        f.close()
        pass
      else:
        print "UNKNOWN"
        pass
      pass
    print "CLOSED"

###################################
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler as WSH
def launch():
    WSGIServer(('', 8383),handler_class=WSH,
               application=app).serve_forever()
