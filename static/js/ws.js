function ws() {
    if (this===window) return new ws();
    var self=this;
    var _ws;
    bindVar(self,'reconnectDelay',1200);

    self.isConnected=function() {
	LOG("READY STATE:"+(_ws?_ws.readyState==1:false));
	return _ws?_ws.readyState==1:false;
    };
    self.toggleCxn=function() {
	LOG('TOGGLE CXN'+_ws);
	if (self.isConnected()) {
	    LOG('TOGGLE CXN2');
	    self.reconnectDelay(0);
	    self.close();
	} else {
	    LOG('TOGGLE CXN3');
	    self.reconnectDelay(1200);
	    self.reconnect();
	}
    };
    self.reconnect=function() {
	LOG('RECONNECT');
	_ws = new WebSocket("ws://localhost:8080/websocket");
	_ws.onopen = function() {
	    LOG('OPN');
	    _ws.send("Hello, world");
	};
	_ws.onmessage = function (evt) {
	    LOG('MSG:'+str(evt.data));
	    _ws.send("Hello, world again");
	};
	_ws.onerror = function (x,y,z) {
	    LOG('ERR'+str(x)+str(y)+str(z));
	};
	_ws.onclose = function () {
	    LOG('CLS:'+self);
	    if (self.reconnectDelay()) {
		LOG('CLS:SET_RECONNECT');
		setTimeout(self.reconnect,self.reconnectDelay());
	    }
	};
    };
    self.close=function(){
	_ws.close();
    };
}
