#from ds.mem import DS
from ds.levelds import DS

def AUTH():
    import bottle, webutil
    params  = bottle.request.params
    headers = bottle.request.headers
    at = params.get('accessToken') or headers.get('Access-Token')
    print "ACCESS TOKEN", repr(at)
    if not DS.auth_user(at):
        print "FAIL"
        raise bottle.abort(499, webutil.errmsg("Invalid Access Token."))
    return at

def LOGIN():
    import bottle, webutil
    params  = request.params
    headers = request.headers
    u = params.get('u') or headers.get('u')
    p = params.get('p') or headers.get('u')
    return DS.login_user(u,p)

import os
if not os.environ.get('NO_AUTO_POPULATE'):
    DS.add_user('v','pass','vat')
    DS.add_user('a','anne','aat')
    DS.add_user('d','d00d','dat')
    pass
