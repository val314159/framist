CMD=function(x){
    try{
	if (!x) { LOG("XXXX NOOP"); return}
	if (x=="?"){
	    LOG("Available Commands:");
	    for(var k in NS)
		LOG(" - "+k+" : "+NS[k].docstr);
	    return}
	if (x[0]=="!"){
	    LOG("XXXX EVAL:" + x);
	    var ret = eval(x.substr(1));
	    LOG("RET:"+str(ret));
	    return}
	var ch = x[0];
	var chars = ".\":!;";
	if (ch=="."||ch=="\""||ch==":"||ch==";"){
	    LOG("XXXX EVAL:" + x);
	    LOG("XXXX EVAL:" + str(ws));
	    var module = ws.listeners.chat;
	    LOG("XXXX MODD:" + module);
	    module.execCmd(x);
	    LOG("XXXX SENT");
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
    }catch(e){
	LOG("ERR:"+str(e));
	return}};

CMD.doc=function(docstr,thing){thing.docstr=docstr;return thing};

NS={connect:CMD.doc('connect websock',function(){ws.connect()}),
    clear : CMD.doc('clear screen',   function(){LOG.clear()})};
G.prototype=NS;
