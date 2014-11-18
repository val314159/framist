console.log("111-111-555");
LOG=function(x){console.log(x)};
function str(x){return(x===window)?"[[[WINDOW]]]":JSON.stringify(x)}
function $GET(url) {return $.ajax({context:this,url:url})}
var $undef, $globals=this;
function addWebSocket(url,self,namespace) {
  LOG("URL:::"+url);
  var on=function(verb,msg){
      var fn = namespace[verb];
      if (fn) fn.apply(self, [msg]);
  };
  var ws = new WebSocket(url);
  ws.onmessage=function(message){
      var msg=JSON.parse(message.data);
      on(msg.method,msg.params);
  };
  ws.onopen =function(evt){ on('$open', evt) };
  ws.onclose=function(evt){ on('$close',evt) };
  ws.onerror=function(evt){ on('$error',evt) };
}
function create(parent) {
    function F(){}
    F.prototype = parent;
    return new F();
}
console.log("999-999-555");
