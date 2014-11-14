
class DS:
    AuthInfo = {}
    AccessInfo = {}

    @classmethod
    def login_user(_,u,p):
        rec = _.AuthInfo.get(u)
        p2 = rec.pop('p')
        return rec if p==p2 else None

    @classmethod
    def auth_user(_,at):
        return True if _.AccessInfo.get(at) else False

    @classmethod
    def add_user(_,u,p,a):
        rec = dict(u=u,p=p,a=a)
        _.AuthInfo  [rec['u']] = rec
        _.AccessInfo[rec['a']] = rec
        pass
    pass
