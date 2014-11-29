function App(){
    if (this===window) return new App()
			   //LOG(">> START APP")
    var self=this
    self.id = "app:"+Math.trunc(Math.random()*1000)
			   //LOG.fmt("ID --> {0} ;",self.id)
    self.execCmd=function(cmdstr){
	//LOG.fmt("EXEC:{0}", cmdstr)
	var arr = cmdstr.split(' ')
	var cmd = arr.shift()
	var d
	if (cmd=='pub') {
	    var channel = arr.shift()
	    var newobj = JSON.parse(arr.join(' '))
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, channel, newobj)
	    d={method:cmd,params:{channel:channel,data:newobj},id:self.id}
	} else if (startsWith(cmd,'.y')) {
	    //LOG.fmt("YELL:{0};",str(cmd))
	    arr.unshift(cmd.substr(2));
	    var msg = arr.join(' ')
	    //LOG.fmt("MSG::{0};",msg)
	    ws.send(str({method:'pub',params:{channel:'y',data:{
				from:[self.channels[0]],typ:'yell',msg:msg
				    }}}))
	} else if (cmd=='sub') {
	    LOG.fmt("[[{0}||{1}]]", cmd, str(arr))
	    var add=[], dlt=[];
	    LOOP(arr,function(v){
		    if (v[0]!='-')  add.push(v);
		    else  dlt.push(v.substr(1));
		});
	    d={method:cmd,params:{add:add,dlt:dlt},id:self.id}
	} else if (cmd=='put') {
	    var key = arr.shift()
	    var newobj = JSON.parse(arr.join(' '))
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, key, newobj)
	    d={method:cmd,params:{key:key,value:newobj},id:self.id}
	} else if (cmd=='get') {
	    var key = arr.shift()
	    LOG.fmt("[[{0}||{1}]]", cmd, key)
	    d={method:cmd,params:{key:key},id:self.id}
	} else if (cmd=='range') {
	    var key0 = arr.shift()
	    var keyn = arr.shift()
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, key0, keyn)
	    d={method:cmd,params:{key0:key0,keyn:keyn},id:self.id}
	} else {
	    LOG("UNKNOWN CMD")
	}
	if (d) {
	    LOG.fmt("D:{0}", str(d))
	    ws.send(str(d))
	}
    }
    self.onMsg=function(msg){
	LOG.fmt("ON MSG:{0}", str(msg))
    }
    App.onchange = function(x){
	LOG(x.value)
	var cmd=x.value
	x.value=''
	self.execCmd(cmd)
    }
    var ws = new WebSocket("ws://localhost:8080/websock?accessToken=vat")
    ws.onopen=function(e){
	LOG("XO"+str(e))
	//LOG("XO=====")
	self.channels=channels=['n?','c0','.c','s','y']
	ws.send(str({method:'sub',params:{add:channels}}))
	ws.send(str({method:'pub',params:{channel:'y',data:{
			    from:[channels[0]],typ:'yell',msg:'HI'
				}}}))
    }
    ws.onmessage=function(e){
	//LOG("ONMESSAGE:"+str(e))
	var j = JSON.parse(e.data)
	//self.onMsg(j)
	if (j.method=='pub') {
	    if (j.params) {
		var data = j.params.data
		if (data) {
		    //LOG("XGOT A REAL PUB" + str(data))
		    if (data.typ=='yell') {
			LOG.fmt("<b>(*{0}*) {1}</b>", data.from, data.msg)
		    }
		}
	    }
	}
    }
    ws.onclose=function(e){
	LOG("XC"+e)
    }
    ws.onerror=function(e){
	LOG("XE"+e)
    }
    //LOG(">> END APP")
}
