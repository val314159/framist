function addWebSocket(self,url,namespace) {
  LOG("SELF:::"+str(self));
  LOG("URL:::"+url);
  var on=function(verb,msg){
      var fn = namespace[verb];
      if (fn) fn.call(self, msg);
  };
  var ws = new WebSocket(url);
  ws.onmessage=function(message){
      var msg=JSON.parse(message.data);
      LOG("MSG:::"+msg+str(msg));
      LOG("MMMMM:::"+msg.method+":::"+namespace);
      on(msg.method,msg.params);
      LOG("xMSG:::"+msg+str(msg));
  };
  ws.onopen =function(evt){ on('$open', evt) };
  ws.onclose=function(evt){ on('$close',evt) };
  ws.onerror=function(evt){ on('$error',evt) };
  self.sendEnc=function(msg){ws.send(str(msg))}
  self.close=ws.close;
}
