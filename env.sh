function freeze() {
  pip freeze >requirements.txt
}

function run_websvr() {
  python -m websvr
}

function run_authsvr() {
  zerorpc --server --bind tcp://*:1234 auth.ds.levelds.DS
}

function clt_auth_login1() {
  zerorpc --client --connect tcp://127.0.0.1:1234 login_user v pass
}

function clt_auth_login2() {
  zerorpc --client --connect tcp://127.0.0.1:1234 login_user vx pass
}

function clt_auth_login3() {
  zerorpc --client --connect tcp://127.0.0.1:1234 login_user v not
}

. .venv/bin/activate
