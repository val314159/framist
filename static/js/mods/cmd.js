CMD=function(x){
    try{
	if (!x) { LOG("XXXX NOOP"); return}
	if (x=="?"){
	    LOG("Available Commands:")
	    for(var k in NS)
		LOG(" - "+k+" : "+NS[k].docstr)
	    return}
	if (x[0]=="!"){
	    LOG("XXXX EVAL:" + x)
	    var ret = eval(x.substr(1))
	    LOG("RET:"+str(ret))
	    return}
	if (x[0]=="="){
	    LOG("XXXX EXEC:" + x)
	    eval(x.substr(1))
	    return}
	var ch = x[0]
	var chars = ".\"\':;"
	if (ch=="."||ch=="\""||ch=="\'"||ch==":"||ch==";"){
	    var module = ws.listeners.chat
	    module._execCmd(x)
	    return}
	var arr = x.split()
	var cmd = arr.shift()
	var fn = NS[cmd]
	if (fn) fn(arr)
	else {
	    LOG("XXXX UNKNOWN CMD:" + cmd)
	    fn = NS.$unknown
	    if (fn) fn(arr,cmd)
	}
    }catch(e){
	LOG("ERR:"+str(e))
	return}}

CMD.doc=function(docstr,thing){thing.docstr=docstr;return thing}

NS={connect:CMD.doc('connect websock',function(){ws.connect()}),
    disconnect:CMD.doc('disconnect websock',function(){ws.close()}),
    reload:CMD.doc('reload page',function(){location=""}),
    clear : CMD.doc('clear screen',   function(){LOG.clear()})}
NS.r=NS.reload
G.prototype=NS
