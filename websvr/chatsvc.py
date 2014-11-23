class ChatSvc:
    def WebUser(svc):
        class ChatUser:
            def sid(_): return id(_.wu)
            def connect(_):
                print "CHAT CONNECT", id(_.wu)
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
