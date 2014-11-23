class ChatSvc:
    def WebUser(svc):
        class ChatUser:
            def sid(_): return _.wu.sid()
            def connect(_):
                print "CHAT CONNECT", _.sid()
                channels=['~x',_.sid(),'nGuest','y','s','*']
                d2=dict(method='hello',params=dict(channels=channels))
                print "D2", d2
                return d2
            def h_connect(_,d):
                print "CHAT H_CONNECT", d, id(_.wu)
                pass
            def not_found(_,d):
                print "CHAT NOT FOUND", d, id(_.wu)
                pass
            def h_intro(_,d):
                print "CHAT INTRO",d
                txt = open('intro.txt').read()
                print "TXT", txt
                print 
                return dict(message=txt)
                pass
            pass
        return ChatUser()
    pass
