from bottle import static_file, abort, Bottle, request
import os,json
app=Bottle()
@app.route('/')
@app.route('/d')
def server_static():
  return static_file('fs/dir.html', root='./static')

from fs import *

@app.route('/ws/fs')
def r_websock():
    ws = request.environ.get('wsgi.websocket')
    if not ws: abort(499,errmsg("Expected WebSocket req."))
    print "OPENED"
    app=FsApp(ws)
    while 1:
        message=ws.receive()
        print "MESSAGE", repr(message)
        if not message:
            break
        msg=json.loads(message)
        if msg['method']=='fs_get':
            app.h_fs_get(msg['params'][0],msg['params'][1])
        elif msg['method']=='fs_put':
            app.h_fs_put(msg['params'][0],msg['params'][1])
        elif msg['method']=='fs_mkdir':
            app.h_fs_mkdir(msg['params'][0])
        elif msg['method']=='fs_rmdir':
            app.h_fs_rmdir(msg['params'][0])
        elif msg['method']=='fs_touch':
            app.h_fs_touch(msg['params'][0])
        elif msg['method']=='fs_unlink':
            app.h_fs_unlink(msg['params'][0])
        elif msg['method']=='fs_system':
            app.h_fs_system(msg['params'][0],msg['params'][1],msg['params'][2])
        else:
            print "UNKNOWN"
            pass
        pass
    print "CLOSED"
    pass

###################################
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler as WSH
def launch():
    WSGIServer(('', 8383),handler_class=WSH,
               application=app).serve_forever()
