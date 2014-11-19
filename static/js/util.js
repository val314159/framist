//LOG=function(x){console.log(x)};
//LOG=function(x){document.body.innerHTML+="<li>"+x};
var ScrollToBottom=function(e){e.scrollTop(e.height())};
var LOG=function(x){
    var e=$('#out');
    e.html( e.html() + "<li>"+x );
    ScrollToBottom($('#outs'));
};
CLR=function(){$('#out').html("")};
function str(x){return(x===window)?"[[[WINDOW]]]":JSON.stringify(x)}
function $GET(url) {return $.ajax({context:this,url:url})}
var $undef, $globals=this;
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
function create(parent) {
    function F(){}
    F.prototype = parent;
    return new F();
}
function fmt() {
    var theString = arguments[0];
    for (var i=1; i<arguments.length; ++i) {
	var regEx = new RegExp("\\{"+(i-1)+"\\}", "gm");
	theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
}
