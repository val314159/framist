
import zerorpc
DS = zerorpc.Client()
print 10901
print 'connecting . . .'
DS.connect("tcp://127.0.0.1:1234")
print 'connected!'
print 10902
