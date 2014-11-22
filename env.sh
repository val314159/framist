export AUTH_PORT=1234
export DS_PORT=1236

freeze() {
  pip freeze >requirements.txt
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
  echo ' *CTRL_C*'
  echo
}

pysleep () {
  python -c"import sys,time;time.sleep(float($1))"
}

run_both() {
  trap ctrl_c 2
  zerorpc --server --bind tcp://*:$AUTH_PORT auth.ds.levelds.DS &
  python -m websvr &
  wait
  kill %1 %2
  echo waiting 1/2 of a second...
  pysleep 0.5
  echo killall python
  killall -9 python 2>/dev/null
  pysleep 0.05 # just to let the output sync up
  echo Done.
  trap 2
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

. .venv/bin/activate

$*
