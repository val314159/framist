
import os,zerorpc
DS = zerorpc.Client()

print 'connecting . . .'
DS.connect("tcp://127.0.0.1:%s"%os.environ['AUTH_PORT'])
print 'connected!'
