function ws() {
    var self=this;
    var _ws;
    self.isConnected=function() {
	LOG("READY STATE:"+_ws.readyState);
	return _ws.readyState==1;
    };
    self.reconnect=function() {
	LOG('RECONNECT');
	_ws = new WebSocket("ws://localhost:8080/websocket");
	LOG('RECONNECT' + _ws.readyState);
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
    bindVar(self,'reconnectDelay',1200);
    self.reconnect();
}
