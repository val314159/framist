function App() {
    var self=this;

    LOG('LAUNCH============');
    websock=new ws();

    self.toggleCxn=function() {
	LOG('TOGGLE CXN'+websock);
	if (websock.isConnected()) {
	    LOG('TOGGLE CXN2');
	    websock.reconnectDelay(0);
	    websock.close();
	} else {
	    LOG('TOGGLE CXN3');
	    websock.reconnectDelay(1200);
	    websock.reconnect();
	}
    }
}
