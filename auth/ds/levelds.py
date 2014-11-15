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
        print 'login'
        try:
            uuid = _.DB().Get('$u.'+u)
            rec  = json.loads(_.DB().Get(uuid))
            print "REC", rec
            p2=rec.pop('p')
            if p==p2:
                print "MATCH"
                return rec
        except KeyError:
            pass
        print "MISMATCH"
        return None

    @classmethod
    def auth_user(_,at):
        print 'auth'
        try:
            _.DB().Get('$a.'+at)
            return True
        except KeyError:
            pass
        return False

    @classmethod
    def add_user(_,u,p,a):
        print 'add user'
        rec = dict(u=u,p=p,a=a)
        uuid = str(uuid1())

        def index_prop(t):
            return _.DB().Put(  '$%s.%s' % (t,rec[t]), uuid)

        _.DB().Put(uuid, json.dumps(rec))
        index_prop('a')
        index_prop('u')
        
        return uuid

    pass
