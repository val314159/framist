function App(){
    if (this===window) return new App()
    var self=this
    self.id = "app:"+Math.trunc(Math.random()*1000)
    self.execCmd=function(cmdstr){
	var arr = cmdstr.split(' ')
	var cmd = arr.shift()
	var d
	if (cmd=='pub') {
	    var channel = arr.shift()
	    var newobj = JSON.parse(arr.join(' '))
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, channel, newobj)
	    d={method:cmd,params:{channel:channel,data:newobj},id:self.id}
	} else if (startsWith(cmd,'.n')) {
	    arr.unshift(cmd.substr(1))
	    var name = arr.join(' ')
	    self.channels[0] = name
	    self.pub(self.channels[1],name,'name')
	} else if (startsWith(cmd,'.c')) {
	    arr.unshift(cmd.substr(1))
	    var newName = arr.join(' ')
	    var oldName = self.channels[1]
	    self.channels[1] = newName
	    self.sub([newName][oldName])
	} else if (startsWith(cmd,'.y')) {
	    arr.unshift(cmd.substr(2));
	    var msg = arr.join(' ')
	    self.pub('y',msg,'yell')
	} else if (startsWith(cmd,'.p')) {
	    var who = arr.shift()
	    var msg = arr.join(' ')
	    self.pub(who,msg,'whisper')
	} else if (startsWith(cmd,'\"')) {
	    var who=self.channels[0];
	    var whom=self.channels[1];
	    arr.unshift(cmd.substr(1));
	    var msg = arr.join(' ')
	    self.pub(whom,msg,'talk')
	} else if (cmd=='sub') {
	    LOG.fmt("[[{0}||{1}]]", cmd, str(arr))
	    var add=[], dlt=[];
	    LOOP(arr,function(v){
		    if (v[0]!='-')  add.push(v);
		    else  dlt.push(v.substr(1));
		});
	    ws.send(str({method:cmd,params:{add:add,dlt:dlt},id:self.id}))
	} else if (cmd=='put') {
	    var key = arr.shift()
	    var newobj = JSON.parse(arr.join(' '))
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, key, newobj)
	    ws.send(str({method:cmd,params:{key:key,value:newobj},id:self.id}))
	} else if (cmd=='get') {
	    var key = arr.shift()
	    LOG.fmt("[[{0}||{1}]]", cmd, key)
	    ws.send(str({method:cmd,params:{key:key},id:self.id}))
	} else if (cmd=='range') {
	    var key0 = arr.shift()
	    var keyn = arr.shift()
	    LOG.fmt("[[{0}||{1}||{2}]]", cmd, key0, keyn)
	    ws.send(str({method:cmd,params:{key0:key0,keyn:keyn},id:self.id}))
	} else {
	    LOG("UNKNOWN CMD")
	}
    }
    /////////////////////////////////////////////////////////
    self.onMsg=function(msg){
	if (msg.method=='pub') {
	    //LOG("101");
	    if (msg.params) {
		//LOG("102");
		var data = msg.params
		if (data) {
		    //LOG("103");
		    if (data.typ=='yell') {
			LOG.fmt("<b>(*{0}*) {1}</b>", data.from, data.msg)
		    } else if (data.typ=='talk') {
			LOG.fmt("({0}) {1}", data.from, data.msg)
		    } else if (data.typ=='whisper') {
			LOG.fmt("<b><i>(p,{0}) {1}</i></b>",data.from,data.msg)
		    } else if (data.typ=='name') {
			LOG.fmt(">> {0} changed thier name to {1}",data.from.substr(1),data.msg.substr(1))
		    } else {
			LOG.fmt("<b>Unknown Data Type: {0}</b><i>{1}</i>",
				data.typ, str(data))
		    }
		}
	    }
	} else if (msg.method=='get') {
	    var key=msg.result[0];
	    if (key=="intro") {
		var val=msg.result[1];
		LOG(">> " + val);
	    } else
		LOG("ON GET UNKNOWN KEY " + str(msg));
	} else
	    LOG("ON MSG UNKNOWN " + str(msg));
    }
    App.onchange = function(x){
	LOG(x.value)
	var cmd=x.value
	x.value=''
	self.execCmd(cmd)
    }
    self.get=function(key){
	ws.send(str({method:'get',params:{key:key}}));
    }
    self.sub=function(add,dlt){
	ws.send(str({method:'sub',params:{add:add,dlt:dlt}}));
    }
    self.pub=function(channel,msg,typ){
	ws.send(str({method:'pub',
		     params:{channel:channel,
			     data:{msg:msg,
				   from:[self.channels[0]],typ:typ}}}));
    }
    self.pub2=function(channel,msg,typ){
	ws.send(str({method:'pub',
		     params:{channel:channel,
			     data:{msg:msg,
				   from:self.channels,typ:typ}}}));
    }
    self.$name=function(name){
	self.channels[0] = 'n'+name;
    }
    self.onopen=function(e){
	LOG(">> Socket opened..."+str(e))
	self.channels=channels=['n?','c0','.c','a','s','y']
	self.get ('intro')
	self.sub (channels)
	//self.pub2('a',  'Hi everyone','announce')
	/*
	self.pub2('a',  'Hi everyone','announce')
	self.pub2('.c', '',           'join')
	self.pub2('.c0','',           'join')
	*/
	self.pub ('y',  'HI',         'yell')
    }
    var ws = new WebSocket("ws://localhost:8080/websock?accessToken=vat")
    ws.onopen=function(e){self.onopen(e)}
    ws.onmessage=function(e){
	//LOG("ON MESSAGE:"+str(e));
	var data=JSON.parse(e.data);
	//LOG("ON MESSAGE DATA:"+str(data));
	if (data.result) {
	    LOG("ON MESSAGE RESULT:"+str(data));
	} else if (data.result===null) {
	    LOG("ON MESSAGE RESULT NULL:"+str(data));
	} else if (data.id) {
	    LOG("ON MESSAGE ID:"+str(data));
	} else if (data.params) {
	    LOG("ON MESSAGE PARAMS:"+str(data));
	    self.onMsg((data));
	} else
	    LOG("WHAAAAA:"+str(data));
    }
    ws.onclose=function(e){LOG("XC"+e)}
    ws.onerror=function(e){LOG("XE"+e)}
}
