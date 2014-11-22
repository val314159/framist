export AUTH_PORT=1234
export DS_PORT=1236

function freeze() {
  pip freeze >requirements.txt
}

function run_websvr() {
  python -m websvr
}

function run_authsvr() {
  zerorpc --server --bind tcp://*:$AUTH_PORT auth.ds.levelds.DS
}

function run_dssvr() {
  zerorpc --server --bind tcp://*:$DS_PORT ds_leveldb.DS
}

function clt_auth_login1() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user v pass
}

function clt_auth_login2() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user vx pass
}

function clt_auth_login3() {
  zerorpc --client --connect tcp://127.0.0.1:$AUTH_PORT login_user v not
}

. .venv/bin/activate

$*
