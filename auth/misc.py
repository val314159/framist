'''
  Misc utils for authsvr.  Mostly involving bottle.
'''

from auth import DS

def AUTH():
    print 1003
    import bottle, webutil
    params  = bottle.request.params
    headers = bottle.request.headers
    at = params.get('accessToken') or headers.get('Access-Token')
    print "ACCESS TOKEN", repr(at)
    if not DS.auth_user(at):
        print "AUTH FAIL"
        raise bottle.abort(499, webutil.errmsg("Invalid Access Token."))
    return at

def LOGIN():
    print 1004
    import bottle, webutil
    params  = request.params
    headers = request.headers
    u = params.get('u') or headers.get('u')
    p = params.get('p') or headers.get('u')
    ret = DS.login_user(u,p)
    if not ret:
        print "LOGIN FAIL"
        raise bottle.abort(499, webutil.errmsg("Access Denied."))
    return ret

def POPULATE():
    print 2001
    DS.add_user('v','pass','vat')
    print 2002
    DS.add_user('a','anne','aat')
    print 2003
    DS.add_user('d','d00d','dat')
    print 2004
    pass

