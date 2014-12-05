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
            path = 'fs/'+msg['params'][0]
            app.h_fs_get(path,msg['params'][1])
        elif msg['method']=='fs_put':
            path = 'fs/'+msg['params'][0]
            app.h_fs_put(path,msg['params'][1])
        elif msg['method']=='fs_mkdir':
            path = 'fs/'+msg['params'][0]
            app.h_fs_mkdir(path)
        elif msg['method']=='fs_rmdir':
            path = 'fs/'+msg['params'][0]
            app.h_fs_rmdir(path)
        elif msg['method']=='fs_touch':
            path = 'fs/'+msg['params'][0]
            app.h_fs_touch(path)
        elif msg['method']=='fs_unlink':
            path = 'fs/'+msg['params'][0]
            app.h_fs_unlink(path)
        elif msg['method']=='fs_system':
            path = msg['params'][0]
            eltName = msg['params'][1]
            cwd = msg['params'][2]
            app.h_fs_system(path,eltName,cwd)
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
