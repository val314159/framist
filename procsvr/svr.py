import gevent.monkey;gevent.monkey.patch_all()
from bottle import route, run, template, default_app, response
import time,sys
from os import system
import gevent

from cors import enable_cors; enable_cors()

@route('/')
def index():
    return ['''proc svr<hr>
<li><a href="/bounce" >bounce </a></li>
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

@route('/killall')
def killall():
    print "QQQQ KA1"
    ret = system('killall -9 python')
    print "QQQQ KA9"
    return '{}'

@route('/start')
def start():
    print "QQQQ START1"
    ret = system('sh env.sh run_all&')
    print "QQQQ START9"
    print "START RET", ret
    return '{}'

@route('/bounce')
def bounce():
    print "QQQQ BOUNCE"
    killall()
    print "QQQQ BOUNCE5"
    gevent.time(0.25)
    print "QQQQ BOUNCE6"
    return start()

@route('/restart')
def restart():
    print "QQQQ RESTART"
    ret = system('sh env.sh run_all&')
    print "START RET", ret
    return '{}'

def xstop():
    print "BYE!"
    ret = system('sh env.sh kill_all&')
    #system('killall -9 python')

@route('/stop')
def stop():
    print "STOP THE WORLD IN 1 SEC"
    gevent.spawn_later(0.1,xstop)
    return '{}'

def main():
    start()
    run(host='', port=8282,
        server='gevent', debug=True)

if __name__=='__main__':main()
