//LOG=function(x){console.log(x)};
//LOG=function(x){document.body.innerHTML+="<li>"+x};
var ScrollToBottom=function(e){e.scrollTop(e.height())};
var LOG=function(x){
    var e=$('#out');
    e.html( e.html() + "<li>"+x );
    ScrollToBottom($('#outs'));
    console.log("112");
};
CLR=function(){$('#out').html("")};
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
