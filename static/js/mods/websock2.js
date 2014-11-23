LOG("Loading websock.js")
var succeeded = true
function WebSock(){
    if (this===window) return new WebSock()
    var self=this
    var ws = closed
    var url = ''
    var listeners=self.listeners={}
    var closed = {
	sendEnc:function(){LOG("websock not connected")},
	close  :function(){LOG("websock not connected")}    }
    self.type='websock'
    self.url=function(_url,at){url=_url+at;return self}
    self.addListener=function(x,ns){listeners[ns]=x;return self}
    self.addPlugin=function(plugin,ns){
	self.addListener(plugin,ns)
	plugin.sendEnc=function(data){self.sendEnc(data,ns);return plugin}
	plugin.ns=ns
	return self}
    var on=function(ns,verb,msg){
	if(!ns){
	    loop(listeners,function(k,v){
		    on(k,verb,msg)
		})
	    return}
	var nspace=listeners[ns]
	if(!nspace)return
	var fn=nspace[verb]
	if(!fn){
	    if (nspace.$unknown)
		nspace.$unknown(self,msg,verb)
	    return}
	try{
	    fn(self, msg)
	}catch(e){
	    LOG("  ERR 8 @ ON = "+ns+"::"+verb+"<"+str(msg)+"> err="+e)
	}
    }
    self.isClosed=function() {
	if(ws===closed)return true
	return ws.closed()}
    self.loginInfo=function(u,p){
	self.username=u
	self.password=p
	return self}
    self.login=function(){
	succeeded=!succeeded
	if (succeeded)
	    self._loginSuccess(self,'vat')
	else
	    self._loginFailure(self)
	return self}
    self.loginSuccess=function(x){self._loginSuccess=x;return self}
    self.loginFailure=function(x){self._loginFailure=x;return self}
    self.connect=function(message){
	if (ws) ws.close()
	ws = new WebSocket(url)
	ws.onmessage=function(message){
	    var msg=JSON.parse(message.data)
	    on(msg.ns,msg.method,msg.params,self)
	}
	ws.onopen =function(evt){on('','$open', evt)}
	ws.onclose=function(evt){on('','$close',evt)}
	ws.onerror=function(evt){on('','$error',evt)}
	return self}
    self.sendEnc=function(msg,ns){
	//LOG("S S SEND ENC" + str([msg,ns]))
	if(ns)msg.ns=ns
	ws.send(str(msg))
	return self}
    self.close = function(){
	ws.close()
	ws=closed
	return self}}
