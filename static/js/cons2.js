function App() {
    if (this===window) return new App();
    var app=this;
    this.type='app';
    function loginUrl(u,p){return fmt("/login?u={0}&p={1}",u,p);}
    var wsUrlFormat="ws://localhost:8080/ws?accessToken={0}";
    function wsockUrl(at ){return fmt(wsUrlFormat,at)}
    function $LOGIN(u,p) {return $.ajax({context:this,url:loginUrl(u,p)})}
    var sid;
    var uinfo = {};
    this.sendCmd=function(ns,method,params,id){
	this.sendEnc({ns:ns,method:method,params:params,id:id});
    }
    var NS = {
	hello: function(params){
	    sid = params.sid;
	    uinfo = {};
	    LOG("NS:HELLO:"+str(params)+str(this)+str(app));
	    this.sendCmd('chat','connect',{sid:sid},true);
	    LOG("NS:HELLO2:"+str(params)+str(this)+str(app));
	},
	connect: function(params){
	    LOG("NS:CONNECT:"+str(params));
	    var d={sid:sid,msg:"hey hey hey"};
	    this.sendCmd('chat','say',{channel:sid,msg:"hey hey hey"},true);
	    LOG("NS:CONNECT2:"+str(params));
	},
	say: function(params){
	    LOG("NS:SAY:"+str(params));
	},
	$open : function(params){
	    LOG("NS:OPEN:"+str(params));
	},
	$close: function(params){
	    LOG("NS:CLOSE:"+str(params));
	},
	$error: function(params){
	    LOG("NS:ERROR:"+str(params));
	},
	$unknown: function(params){
	    LOG("NS:UNKNOWN:"+str(params));
	}
    };
    this.main = function() {
	$LOGIN.call(this,'v','pass').then
	(
	 function(data){
	     LOG("zDATA:"+str(data)+'//'+str(app)+'//'+str(this));
	     addWebSocket(this,wsockUrl(data.a),create(NS));
	 },
	 function(a,b,c){
	     LOG("ERR");
	 });
    }
    return this;
}
