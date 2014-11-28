from bottle import route, static_file
@route('/static/<filepath:path>')
def server_static(filepath):
  return static_file(filepath, root='./static')
from auth.misc import LOGIN,AUTH
from webutil import WEB_SOCKET
@route('/login')
def r_login(): return LOGIN()
@route('/websock')
def r_websock(): App(WEB_SOCKET(),AUTH()).run()
###################################
from ba import BaseApp
from ps import PubSubMixin
from ds import DatastoreMixin
class App(BaseApp,PubSubMixin,DatastoreMixin): pass
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler as WSH
def launch():
    from auth.misc import POPULATE
    POPULATE()
    WSGIServer(('', 8080),handler_class=WSH).serve_forever()
