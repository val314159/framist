var WS;
function reconnect() {
    LOG('RECONNECT');
    WS=new ws();
}
function toggleCxn() {
    LOG('TOGGLE CXN');
    if (!WS) {
	reconnect();
    } else {
	WS.reconnectDelay(0);
	WS.close();
	WS = null;
    }
}
