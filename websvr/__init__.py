from bottle import Bottle, static_file

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
from auth.misc import LOGIN,AUTH,POPULATE

@app.route('/login')
def r_login():
    print "RRR /login"
    return LOGIN()
###################################
from webuser import WebUser
from webuser2 import WebUser2
from webutil import WEB_SOCKET

@app.route('/ws')
def r_websocket():
    print "RRR /ws"
    wu=WebUser(AUTH(),WEB_SOCKET())
    print "RRR3 /ws"
    wu.run()
@app.route('/ws2')
def r_websocket2():
    print "RRR /ws2"
    wu=WebUser2(AUTH(),WEB_SOCKET())
    print "RRR3 /ws2"
    wu.run()
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

def launch():
    POPULATE()
    server = WSGIServer(("0.0.0.0", 8080), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
