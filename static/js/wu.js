function wu() {
    if (this===window) return new wu();
    var self=this;
    var ws;
    bindVar(self,'$reconnectDelay',1200);
    bindVar(self,'$name', 'NEWGUY');
    bindVar(self,'$channel', 'main...');
    bindVar(self,'$accessToken');
    self.$accessToken('vat');

    self.isConnected=function() {
	LOG("READY STATE:"+(ws?ws.readyState==1:false));
	return ws?ws.readyState==1:false;
    };
    self.dump = function(){
	LOG("DUMP:" + str(self));
    };
    self.toggleCxn=function() {
	LOG('TOGGLE CXN'+ws);
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
	ws = new WebSocket("ws://localhost:8080/websocket?"+
			    "accessToken="+self.accessToken);
	ws.onopen = function(evt) {
	    LOG('OPN'+evt);
	    LOG('OPN'+str(evt));
	    LOG('OPN'+str(self));
	    LOG('OPN'+str(self.name));
	    ws.send(str([0,'chat','connect',[self.name]]));
	};
	ws.onmessage = function (evt) {
	    LOG('MSG:'+str(evt.data));
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
