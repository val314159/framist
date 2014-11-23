import gevent.monkey;gevent.monkey.patch_all()
from bottle import route, run, template
import time
from os import system

@route('/')
def index():
    return ['''proc svr<hr>
<li><a href="/ps"     >ps     </a></li>
<li><a href="/restart">restart</a></li>
<li><a href="/stop"   >stop   </a></li>
''']

@route('/ps')
def ps():
    ret = system('ps auxww|grep python|grep -v grep')
    print "PS RET", ret
    return 'I dunno yet'

@route('/restart')
def restart():
    print "QQQQ RESTART"
    ret = system('sh install.sh run_both&')
    print "START RET", ret
    return 'I dunno yet'

@route('/stop')
def stop():
    print '-'*80,1
    ret = system('ps auxww|grep python|grep -v grep')
    print '-'*80
    system('(sleep 2;killall -9 python)&')
    return 'I dunno yet'

def main():
    restart()
    run(host='localhost', port=8282,
        server='gevent', debug=True)

if __name__=='__main__':main()
