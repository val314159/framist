from app import app
from webuser import WebUser
from auth.misc import *
from webutil import *

@app.route('/login')
def r_login():
    print "RRR /login"
    return LOGIN()

@app.route('/websocket')
def r_websocket():
    print "RRR /websocket"
    at = AUTH()
    wsock = get_websocket()
    user = WebUser(at,wsock)
    user.run()
