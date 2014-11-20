NS={
    connect:function(){
	ws.connect();
    }
};
CMD=function(x){
    if (!x) { LOG("XXXX NOOP"); return; }
    if (x[0]=="!") { LOG("XXXX EVAL:" + x);
		     var ret = eval(x.substr(1));
		     LOG("RET:"+str(ret));
		     return; }
    var arr = x.split();
    LOG("XXXX CMD:" + str(arr));
    var cmd = arr.shift();
    var fn = NS[cmd];
    if (fn) fn(arr);
    else    LOG("XXXX UNKNOWN CMD:" + cmd);
};
