var WS;
function ws() {
    var _ws = new WebSocket("ws://localhost:8080/websocket");
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
	LOG('CLS100');
	if (WS && WS.reconnectDelay)
	    setTimeout(reconnect,WS.reconnectDelay);
    };
    return {self:_ws,reconnectDelay:1200};
}
function reconnect() {
    LOG('RECONNECT');
    WS=ws();
}
function clicky() {
    LOG('CLICKY');
    WS.reconnectDelay = 0;
    WS.self.close();
}
