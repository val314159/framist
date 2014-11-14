import leveldb, json
from uuid import uuid1

class DS:
    @classmethod
    def DB(_,__=[]):
        if not __:
            db=leveldb.LevelDB('.db')
            __.append(db)
            pass
        return __[0]

    @classmethod
    def login_user(_,u,p):
        try:
            rec = _.DB().Get('$u.'+u)
            if p==rec.pop('p'): return rec
        except KeyError:
            pass
        return None

    @classmethod
    def auth_user(_,at):
        try:
            _.DB().Get('$a.'+at)
            return True
        except KeyError:
            pass
        return False

    @classmethod
    def add_user(_,u,p,a):
        rec = dict(u=u,p=p,a=a)
        uuid = str(uuid1())

        def index_prop(t):
            return _.DB().Put(  '$%s.%s' % (t,rec[t]), uuid)

        _.DB().Put(uuid, json.dumps(rec))
        index_prop('a')
        index_prop('u')
        
        return uuid

    pass
