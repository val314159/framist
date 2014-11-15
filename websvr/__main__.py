import app

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

if __name__=='__main__':
    from auth.misc import POPULATE
    POPULATE()
    server = WSGIServer(("0.0.0.0", 8080), app.app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
