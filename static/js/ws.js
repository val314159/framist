function ws() {
    if (this===window) return new ws();
    var self=this;
    var _ws;
    bindVar(self,'$reconnectDelay',1200);
    bindVar(self,'$name', 'NEWGUY');
    bindVar(self,'$channel', 'main...');
    bindVar(self,'$accessToken');
    self.$accessToken('vat');

    self.isConnected=function() {
	LOG("READY STATE:"+(_ws?_ws.readyState==1:false));
	return _ws?_ws.readyState==1:false;
    };
    self.dump = function(){
	LOG("DUMP:" + str(self));
    };
    self.toggleCxn=function() {
	LOG('TOGGLE CXN'+_ws);
	if (self.isConnected()) {
	    LOG('TOGGLE CXN2');
	    self.$reconnectDelay(0);
	    self.close();
	} else {
	    LOG('TOGGLE CXN3');
	    self.$reconnectDelay(null,'reset');
	    // nice to have: self.$reconnectDelay.reset();
	    self.reconnect();
	}
    };
    self.reconnect=function() {
	LOG('RECONNECT');
	_ws = new WebSocket("ws://localhost:8080/websocket?"+
			    "accessToken="+self.$accessToken());
	_ws.onopen = function() {
	    LOG('OPN');
	    LOG('OPN'+str(self));
	    LOG('OPN'+str(self.$name()));	    
	    _ws.send(str([0,'chat','connect',[self.$name()]]));
	};
	_ws.onmessage = function (evt) {
	    LOG('MSG:'+str(evt.data));
	};
	_ws.onerror = function (x,y,z) {
	    LOG('ERR'+str(x)+str(y)+str(z));
	};
	_ws.onclose = function () {
	    LOG('CLS:'+self);
	    if (self.$reconnectDelay()) {
		LOG('CLS:SET_RECONNECT');
		setTimeout(self.reconnect,self.$reconnectDelay());
	    }
	};
    };
    LOG("1007");
    self.send =function(data){_ws.send(data);};
    self.close=function(){    _ws.close();   };
    LOG("1009");
}
