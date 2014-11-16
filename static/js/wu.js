function wu() {
    if (this===window) return new wu();
    var self=this;
    var ws;
    bindVar(self,'$reconnectDelay',1200);
    bindVar(self,'$name',         'N00b',   '#name');
    bindVar(self,'$channel',      'main...','#channel');
    bindVar(self,'$accessToken');
    self.$accessToken('vat');

    self.isConnected=function() {
	LOG("READY STATE:"+(ws?ws.readyState==1:false));
	return ws?ws.readyState==1:false;
    };
    self.dump = function(){
	LOG("DUMP:" + str(self));
    };

    self.whoList=function() {
	ws.send(str([0,'chat','whoList',[]]));
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
	LOG('RECONNECT'+self.accessToken);
	ws = new WebSocket("ws://localhost:8080/websocket?"+
			    "accessToken="+self.accessToken);
	ws.onopen = function(evt) {
	    LOG('OPN'+str(evt));
	    LOG('OPN'+str([self.name,self.channel]));
	    ws.send(str([0,'chat','connect',[self.name,self.channel]]));
	};
	ws.onmessage = function (evt) {
	    LOG('MSG1:'+str(evt.data));
	    var data = JSON.parse(evt.data);
	    LOG('MSG9:'+str(data));
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
