function $getSelf(_self,_this){
    return(_self!==undefined)?self
	: (_this!==window && _this!==undefined)?_this
	: new(function(){})()}
function addWebSocket(self,url,namespace) {
    self=$getSelf(self,this);
    LOG("SELF:::"+str(self));
    LOG("URL:::"+url);
    var on=function(verb,msg){
	var fn = namespace[verb];
	if (fn) fn.call(self, msg);
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
    self.sendEnc=function(msg){ws.send(str(msg))}
    self.close=function(){ws.close();ws=closed}}