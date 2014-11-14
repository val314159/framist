from app import app
import static_routes
import websock

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

if __name__=='__main__':
    server = WSGIServer(("0.0.0.0", 8080), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
