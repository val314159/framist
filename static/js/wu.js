function wu() {
    if (this===window) return new wu();
    var self=this;
    var ws;
    bindVar(self,'$reconnectDelay',1200);
    bindVar(self,'$name',         'N00b',   '#name',function(value){
	    if(ws)ws.send(str([0,'chat','name',[value]]));
	});
    bindVar(self,'$channel',      'main...','#channel',function(value){
	    if(ws)ws.send(str([0,'chat','channel',[value]]));
	});
    bindVar(self,'$accessToken')('vat');

    self.isConnected=function() {
	LOG("READY STATE:"+(ws?ws.readyState==1:false));
	return ws?ws.readyState==1:false;
    };
    self.whoList=function() {
	ws.send(str([0,'chat','whoList',[]]));
    };
    self.toggleCxn=function() {
	if (self.isConnected()) {
	    LOG('TOGGLE CXN2');
	    self.$reconnectDelay(0);
	    self.close();
	} else {
	    LOG('TOGGLE CXN3');
	    self.$reconnectDelay.reset();
	    self.reconnect();
	}
    };
    self.process=function(key,dat) {
	if (key=="whoList") {
	    LOG(' !* !* !* '+str(dat));
	} else if (key=="connect") {
	    LOG(' !+ !+ !+ '+str(dat));
	} else if (key=="disconnect") {
	    LOG(' !- !- !- '+str(dat));
	} else if (key=="yell") {
	    LOG(' !! !! !! '+str(dat));
	} else if (key=="say") {
	    LOG(' !. !. !. '+str(dat));
	} else if (key=="whisper") {
	    LOG(' !~ !~ !~ '+str(dat));
	} else if (key=="hello") {
	    LOG(' !^ !^ !^ '+str(dat));
	} else {
	    LOG(' ?? ?? ?? '+str(dat));
	}
    };
    self.reconnect=function() {
	LOG('RECONNECT'+self.accessToken);
	ws = new WebSocket("ws://localhost:8080/websocket"+
			   "?accessToken="+self.accessToken)
	ws.onopen = function(evt) {
	    LOG('OPN'+str([self.name,self.channel]));
	    ws.send(str([0,'chat','connect',[self.name,self.channel]]));
	};
	ws.onmessage = function (evt) {
	    var data = JSON.parse(evt.data);
	    for (var key in data) {
		self.process(key,data[key]);
	    }
	};
	ws.onerror = function (x,y,z) {
	    LOG('ERR'+str(x)+str(y)+str(z));
	};
	ws.onclose = function () {
	    LOG('CLS:'+self);
	    if (self.reconnectDelay) {
		LOG('CLS:SET_RECONNECT');
		setTimeout(self.reconnect,self.reconnectDelay);
	    }
	};
    };
    self.send =function(data){ws.send(data);};
    self.close=function(){    ws.close();   };
}
