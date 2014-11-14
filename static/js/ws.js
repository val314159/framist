function ws() {
    var self=this;
    var _ws = this._ws = new WebSocket("ws://localhost:8080/websocket");
    _ws.onopen = function() {
	LOG('OPN');
	_ws.send("Hello, world");
    };
    _ws.onmessage = function (evt) {
	LOG('MSG:'+str(evt.data));
	_ws.send("Hello, world again");
    };
    _ws.onerror = function () {
	LOG('ERR');
    };
    _ws.onclose = function () {
	LOG('CLS100'+self);
	if (self.reconnectDelay()) {
	    LOG('CLS200');
	    setTimeout(reconnect,self.reconnectDelay());
	}
    };

    self.close=function(){_ws.close();};

    bindVar(this,'reconnectDelay',1200);
}
