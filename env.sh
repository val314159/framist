export AUTH_PORT=1234
export DS_PORT=1236

restart () {
  curl localhost:8282/restart
}

alias rs='restart;fg'

realclean () {
  echo REAL CLEAN 0
  rm -fr .venv .db
  find . -name \*~ | xargs rm
  find . -name \*.pyc | xargs rm
  find . -name \#\*\# | xargs rm
  find . -name .\#\*  | xargs rm
  echo REAL CLEAN 9
}

freeze() {
  pip freeze >requirements.txt
}

loop_procsvr() {
  while true; do
    run_procsvr
    pysleep 0.2
  done
}

run_procsvr() {
  killall -9 python
  pysleep 0.2
  python -m procsvr
}

run_websvr() {
  python -m websvr
}

run_fssvr() {
  python -m fssvr
}

run_authsvr() {
  zerorpc --server --bind tcp://*:$AUTH_PORT auth.ds.levelds.DS
}

run_dssvr() {
  zerorpc --server --bind tcp://*:$DS_PORT ds_leveldb.DS
}

ctrl_c() {
  echo
  echo '>> *CTRL_C* Intercepted'
}

pysleep () {
  python -c"import sys,time;time.sleep(float($1))"
}

run_all() {
  trap ctrl_c SIGINT
  echo '>> Starting ALL...'
  echo '>> Starting AuthSvr...'
  run_authsvr &
  pysleep 0.1
  echo '>> Started AuthSvr.'
  echo '>> Starting WebSvr...'
  run_websvr &
  pysleep 0.1
  echo '>> Started WebSvr...'
  echo '>> Starting FsSvr...'
  run_fssvr &
  pysleep 0.1
  echo '>> Started FsSvr...'
  echo '>> Started ALL.'
  wait
  echo '>> Loop complete.  Kill kids...' $? QQQ
  kill %1 %2
  echo '>> waiting 1/10 of a second...'
  pysleep 0.1
  echo '>> killall python'
  killall -9 python 2>/dev/null
  pysleep 0.05 # just to let the output sync up
  echo '>> Done.'
  trap SIGINT
}

clt_auth_login1() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user v pass
}

clt_auth_login2() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user vx pass
}

clt_auth_login3() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user v not
}

if [ -d .venv ]
then . .venv/bin/activate
fi

$*
