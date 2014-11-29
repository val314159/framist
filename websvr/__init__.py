from bottle import route, static_file, abort
@route('/static/<filepath:path>')
def server_static(filepath):
  return static_file(filepath, root='./static')
from auth.misc import LOGIN,AUTH,POPULATE
@route('/login')
def r_login(): return LOGIN()
@route('/websock')
def r_websock():
    ws = request.environ.get('wsgi.websocket')
    if not ws:
        raise abort(499,errmsg("Expected WebSocket req."))
    App(ws,AUTH()).run()
###################################
from ba import BaseApp
from ps import PubSubMixin
from ds import DatastoreMixin
class App(BaseApp,PubSubMixin,DatastoreMixin): pass
###################################
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler as WSH
def launch():
    POPULATE()
    WSGIServer(('', 8080),handler_class=WSH).serve_forever()
