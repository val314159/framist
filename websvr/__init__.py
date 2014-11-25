from bottle import Bottle, static_file
import json
app = Bottle()

@app.route('/')
def index():
    return static_file('main.html', root='./static')

@app.route('/js/<filename>')
def server_static(filename):
    return static_file(filename, root='./static/js')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')
###################################
from auth.misc import LOGIN,AUTH
from webutil import WEB_SOCKET

@app.route('/login')
def r_login():
    print "RRR /login"
    return LOGIN()

@app.route('/ws')
def r_websocket():
    from webuser import WebUser
    print "RRR /ws"
    wu=WebUser(AUTH(),WEB_SOCKET())
    print "RRR3 /ws"
    wu.run()

def WSS(_=[]):
    if not _:
        from websocketservices import WebSocketServices
        from chatsvc import ChatSvc
        from dssvc import DatastoreSvc
        _.append( WebSocketServices()
                  .addSvc(ChatSvc(), 'chat')
                  .addSvc(DatastoreSvc(), 'ds')
                  )
        pass
    return _[0]

@app.route('/ws2')
def r_websocket2():
    print "RRR /ws2"
    wu = WSS().WebUser(AUTH(),WEB_SOCKET())
    print "RRR3 /ws2"
    wu.run()
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

def launch():
    from auth.misc import POPULATE
    POPULATE()
    server = WSGIServer(("0.0.0.0", 8080), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
