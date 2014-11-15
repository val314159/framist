function ws() {
    if (this===window) return new ws();
    LOG("QQQQQQQQQQQ");
    var self=this;
    var _ws;
    var _wu = wu(self);
    self.wu = _wu;
    bindVar(self,'reconnectDelay',1200);
    bindVar(self,'accessToken');
    self.accessToken('vat');
    self.isConnected=function() {
	LOG("READY STATE:"+(_ws?_ws.readyState==1:false));
	return _ws?_ws.readyState==1:false;
    };
    LOG("QQQQQQQQQQQ2");
    self.changeName = function(newName){
	LOG("CN");
	_wu.name(newName);
	LOG("CN2");
	_ws.send(str([0,'user', 'name',
		      [newName], ]));
	LOG("CN3");
    };
    LOG("QQQQQQQQQQQ3");
    LOG("QQQQQQQQQQQ4"+ self.changeName);
    self.toggleCxn=function() {
	LOG('TOGGLE CXN'+_ws);
	if (self.isConnected()) {
	    LOG('TOGGLE CXN2');
	    self.reconnectDelay(0);
	    self.close();
	} else {
	    LOG('TOGGLE CXN3');
	    self.reconnectDelay(null,'reset');
	    // nice to have: self.reconnectDelay.reset();
	    self.reconnect();
	}
    };
    self.reconnect=function() {
	LOG('RECONNECT');
	_ws = new WebSocket("ws://localhost:8080/websocket?accessToken="
			    +self.accessToken());
	_ws.onopen = function() {
	    LOG('OPN');
	    _ws.send("Hello, world");
	};
	_ws.onmessage = function (evt) {
	    LOG('MSG:'+str(evt.data));
	    _ws.send("Hello, world again");
	    _wu.send_data(evt.data);
	};
	_ws.onerror = function (x,y,z) {
	    LOG('ERR'+str(x)+str(y)+str(z));
	};
	_ws.onclose = function () {    LOG('CLS:'+self);
	    if (self.reconnectDelay()) {
		LOG('CLS:SET_RECONNECT');
		setTimeout(self.reconnect,self.reconnectDelay());
	    }
	};
	LOG("SET WS" + _ws);
	_wu.wsock(_ws);
    };
    self.send_data=function(data){_ws.send(data);};
    self.send=function(data){_ws.send(data);};
    self.close=function(){  _ws.close();  };
}
