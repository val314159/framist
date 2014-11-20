LOG("Loading websock.js");
function WebSock(){
    if (this===window) return new WebSock();
    var self=this;
    self.type='websock';
    var url, listeners = {};
    self.url=function(_url){url=_url;return self}
    self.addListener=function(x,ns){listeners[ns]=x;return self;}
    self.addPlugin=function(plugin,name){
	self.addListener(plugin,name);
	plugin.addSpeaker(self);
	return self;}
    var on=function(verb,msg){
	LOG(" @@@@ ON = "+verb+"[["+msg+"]]");
	//var fn = namespace[verb];
	///if (fn) fn.call(self, msg);
    };
    self.isClosed=function() {
	if (ws===closed) return true;
	return ws.closed();
    };
    var closed = {
	sendEnc:function(){LOG("websock not connected")},
	close  :function(){LOG("websock not connected")}
    };
    var ws = closed;
    self.connect=function(message){
	ws = new WebSocket(url);
	ws.onmessage=function(message){
	    var msg=JSON.parse(message.data);
	    LOG("+++MSG:::"+msg+str(msg));
	    on(msg.method,msg.params);
	    LOG("---MSG:::"+msg+str(msg));
	};
	ws.onopen =function(evt){ on('$open', evt) };
	ws.onclose=function(evt){ on('$close',evt) };
	ws.onerror=function(evt){ on('$error',evt) };
	return self}
    self.sendEnc=function(msg){ws.send(str(msg));return self}
    self.close = function(){ws.close();ws=closed;return self}}