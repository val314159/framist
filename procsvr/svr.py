import gevent.monkey;gevent.monkey.patch_all()
from bottle import route, run, template
import time,sys
from os import system

@route('/')
def index():
    return ['''proc svr<hr>
<li><a href="/ps"     >ps     </a></li>
<li><a href="/restart">restart</a></li>
<li><a href="/stop"   >stop   </a></li>
<hr>
<li><a href="http://localhost:8080">web server</a></li>
''']

@route('/ps')
def ps():
    from subprocess import Popen,PIPE
    try:
        p = Popen('ps auxww|grep python|grep -v grep',
                        shell=True,stdout=PIPE)
        output = p.communicate()[0]
        retcode = p.returncode
        if retcode < 0:
            print >>sys.stderr, "Child was terminated by signal", -retcode
        else:
            print >>sys.stderr, "Child returned", retcode
            pass
        return dict(response=output.split('\n'))
    except OSError as e:
        print >>sys.stderr, "Execution failed:", e
        pass
    return 'I dunno yet'

@route('/restart')
def restart():
    print "QQQQ RESTART"
    ret = system('sh install.sh run_both&')
    print "START RET", ret
    return 'I dunno yet'

@route('/stop')
def stop():
    print "STOP THE WORLD IN 2 SECS"
    system('(sleep 2;killall -9 python)&')
    return 'I dunno yet'

def main():
    restart()
    run(host='', port=8282,
        server='gevent', debug=True)

if __name__=='__main__':main()
