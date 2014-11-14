function ws() {
    var self=this;
    var _ws = new WebSocket("ws://localhost:8080/websocket");
    self._ws = _ws;
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
	    setTimeout(reconnect,self.reconnectDelay());
	}
    };
    self.close=function(){
	_ws.close();
    };
    bindVar(self,'reconnectDelay',1200);
}
