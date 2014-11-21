CMD=function(x){
    if (!x) { LOG("XXXX NOOP"); return}
    if (x=="?"){
	LOG("Available Commands:");
	for(var k in NS)
	    LOG(" - "+k+" : "+NS[k].docstr);
	return}
    if (x[0]=="!")try{
	    LOG("XXXX EVAL:" + x);
	    var ret = eval(x.substr(1));
	    LOG("RET:"+str(ret));
	    return;
	}catch(e){
	    LOG("ERR:"+str(e));
	    return}
    var arr = x.split();
    LOG("XXXX CMD:" + str(arr));
    var cmd = arr.shift();
    var fn = NS[cmd];
    if (fn) fn(arr);
    else {
	LOG("XXXX UNKNOWN CMD:" + cmd);
	fn = NS.$unknown;
	if (fn) fn(arr,cmd);
    }
};

CMD.doc=function(docstr,thing){thing.docstr=docstr;return thing};

NS={connect:CMD.doc('connect websock',function(){ws.connect()}),
    clear : CMD.doc('clear screen',   function(){LOG.clear()})};
G.prototype=NS;
