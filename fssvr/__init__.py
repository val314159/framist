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
        fname = 'fs/'+msg['params'][0]
        data = open(fname).read()
        eltName = msg['params'][1]
        ws.send(json.dumps({"result":[fname,data,eltName]}))
      elif msg['method']=='fs_ls':
        print "LSSSSS", msg['params'][0]
        path = 'fs/'+msg['params'][0]
        data=os.listdir(path)
        ws.send(json.dumps({"result":[path,data]}))
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
