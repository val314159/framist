
import os,zerorpc
DS = zerorpc.Client()

print 'connecting to authsvr . . .'
DS.connect("tcp://127.0.0.1:%s"%os.environ['AUTH_PORT'])
print 'connected to authsvr!'
