export AUTH_PORT=1234
export DS_PORT=1236

test1 () {
 echo TEST ONE
}

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
      echo qq 11
    run_procsvr
      echo qq 22
    sleep 2
      echo qq 33
  done
}

run_procsvr() {
  python -m procsvr
}

run_websvr() {
  python -m websvr
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

run_both() {
  trap ctrl_c SIGINT
  echo '>> Starting AuthSvr...'
  run_authsvr &
  pysleep 0.2
  echo '>> Starting WebSvr...'
  run_websvr &
  pysleep 0.2
  echo '>> Started.'
  wait
  echo '>> Loop complete.  Kill kids...' $? QQQ
  kill %1 %2
  echo '>> waiting 1/2 of a second...'
  pysleep 0.5
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