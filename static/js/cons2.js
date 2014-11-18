function App() {
    console.log("0 app 0");
    if (this===window) return new App();
    function loginUrl(u,p){return fmt("/login?u={0}&p={1}",u,p);}
    var wsUrlFormat="ws://localhost:8080/ws?accessToken={0}";
    function wsockUrl(at ){return fmt(wsUrlFormat,at)}
    function $LOGIN(u,p) {
	console.log("LOGIN THIS "+this);
return $.ajax({context:this,url:loginUrl(u,p)})}
    var self = this;
    var app = this;
    var NS = {
	hello: function(params){
	    LOG("HELLO:"+str(params));
	},
	$open : function(params){
	    LOG("OPEN:"+str(params));
	},
	$close: function(params){
	    LOG("CLOSE:"+str(params));
	},
	$error: function(params){
	    LOG("ERROR:"+str(params));
	},
	$unknown: function(params){
	    LOG("UNKNOWN:"+str(params));
	}
    };
    this.main = function() {
	console.log("PRELOGIN THIS "+this);
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
