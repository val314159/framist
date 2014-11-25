def DB(__=[]):
    if not __:
        import leveldb
        __.append( leveldb.LevelDB('.ds') )
        pass
    return __[0]

class DatastoreSvc:
    def __init__(_): _.Users={}
    def disconnect(_,sid):
        print "CHAT DISCONNECT", sid, _.Users
        _.pub(dict(method='disconnect',params={'sid':sid,'channel':'s'}))
        pass
    def pub(_,data,id=None):
        print "PUB DATA", data, id
        if id: data['id'] = id
        print "PUB DATA", data, id
        for sid,user in _.Users.iteritems():
            print "SUD USER", sid, user
            user.send(data)
            pass
        pass
    def WebUser(svc):
        class DatastoreUser:

            def send(_,data):
                print ":::: WHAT TO SEND :::::",_
                print ":::: WHAT TO SEND :::::",data
                print ":::: WHAT TO SEND :::::",_.wu
                print ":::: WHAT TO SEND :::::",_.wu.send_method
                print ":::: WHAT TO SEND :::::"
                _.wu.send(data)
                pass

            def __init__(_): _.channels = None
            def sid(_): return _.wu.sid()
            def connect(_):
                print "CHAT CONNECT", _.sid(), svc.Users
                channels=['~Porn Store',_.sid(),'nNewbie','y','s','*']
                _.wu.send( dict(method='hello',params=dict(channels=channels)) )
                return dict(method='hello',params=dict(channels=channels))
            def activate(_):
                svc.Users[_.sid()] = _
                pass
            def deactivate(_):
                try   : del svc.Users[_.sid()]
                except: pass
                pass
            def h_connect(_,d):
                print "CHAT H_CONNECT", d, id(_.wu)
                _.channels = d['params']['channels']
                _.activate()
                print "CHAT H_CONNECT2", d, id(_.wu)
                pass
            def h_sub(_,d):
                print "CHAT H_SUB", d, id(_.wu)
                _.activate()
                add_channels = d['params'].get('add_channels')
                del_channels = d['params'].get('del_channels')
                len_add_channels=len(add_channels)
                len_del_channels=len(del_channels)
                min_len = min(len_add_channels,len_del_channels)
                for i in xrange(min_len):
                    a = add_channels[i]
                    d = del_channels[i]
                    n = _.channels.index(d)
                    _.channels[n] = a
                    pass
                if len_add_channels>len_del_channels:
                    _.channels.extend(add_channels[min_len:])
                elif len_add_channels<len_del_channels:
                    for ch in del_channels[min_len:]:
                        _.channels.remove(ch)
                        pass
                    pass
                print "CHAT H_SUB2", d, id(_.wu)
                pass
            def h_disconnect(_,d):
                print "CHAT H_UNSUBALL", d, id(_.wu)
                svc.pub(d)
                _.deactivate()
                _.channels = None
                print "CHAT H_UNSUBALL2", d, id(_.wu)
                pass
            def h_pub(_,d):
                print "CHAT H_PUB", d, id(_.wu)
                k=d['params']['channel']
                v=d['params']['msg']
                print "CSET %s ==> %s", d['params']['channel']
                print "MSET %s ==> %s", d['params']['msg']

                import json
                DB().Put(k,(v))

                d['params']['from']['id']=_.sid()
                svc.pub(d, _.sid())
                pass
            def h_whoList2(_,d):
                print "WH2","o"*5000, d
                db=list(DB().RangeIter())
                channels=['shycats','~Porn Store',_.sid(),'nNewbie','y','s','*']
                key=d['params']['key']
                try   : result=DB().Get(key)
                except: result=None
                _.wu.send( dict(method='hello',params=dict(channels=channels,
                                                           key=key,result=result)) )
                return
            def h_whoList(_,d):
                print "WH","o"*5000
                db=list(DB().RangeIter())
                channels=['shycats','~Porn Store',_.sid(),'nNewbie','y','s','*']
                _.wu.send( dict(method='hello',params=dict(channels=channels,db=db)) )
                return
                svc.Users[_.sid()] = _
                d = dict(method='whoList',params=dict(
                        results=svc.Users))
                print "WHO D", d
                arr = []
                for k,user in svc.Users.iteritems():
                    print "XWHO D", k,user.channels
                    arr.append(user.channels)
                    pass
                return dict(method='whoList',params=dict(
                        results=arr))
            def not_found(_,d):
                print "CHAT NOT FOUND", d, id(_.wu)
                pass
            def h_intro(_,d):
                print "CHAT INTRO",d
                txt = open('intro.txt').read()
                print "TXT", txt
                return dict(message=txt)
                pass
            pass
        return DatastoreUser()
    pass
