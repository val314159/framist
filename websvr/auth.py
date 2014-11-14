import os,sys,traceback as tb,gevent,bottle,json,webutil

#############################

AuthInfo = {}
AccessInfo = {}

def add_user(u,p,a):
    rec = dict(u=u,p=p,a=a)
    AuthInfo  [rec['u']] = rec
    AccessInfo[rec['a']] = rec

def login_user(u,p):
    rec = AuthInfo.get(u)
    p2 = rec.pop('p')
    return rec if p==p2 else None

def auth_user(at):
    return True if AccessInfo.get(at) else False

def AUTH():
    import bottle
    params  = bottle.request.params
    headers = bottle.request.headers
    at = params.get('accessToken') or headers.get('Access-Token')
    print "ACCESS TOKEN", repr(at)
    if not auth_user(at):
        print "FAIL"
        raise bottle.abort(499, webutil.errmsg("Invalid Access Token."))
    return at

add_user('v','pass','vat')
add_user('a','anne','aat')
add_user('d','d00d','dat')

#############################
