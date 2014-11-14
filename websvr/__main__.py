import static_routes
import websock

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

import webutil

if __name__=='__main__':
    webutil.launch()
    #server = WSGIServer(("0.0.0.0", 8080), app,
    #                    handler_class=WebSocketHandler)
    #server.serve_forever()
