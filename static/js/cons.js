console.log("111-111-111");
function loginUrl(u,p){return"/login?u="+u+"&p="+p}
function wsockUrl(at ){return"ws://localhost:8080/ws?accessToken="+at}
function App() {
    if (this===window) return new App();
    var self = this;
    this.main = function() {
	$GET(loginUrl('v','pass')).then
	(
	 function(data){
	     LOG("DATA:"+str(data)+'//'+str(app));
	     var d = create(
    {
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
    });
	     addWebSocket(wsockUrl(data.a),self,d);
	 },
	 function(a,b,c){
	     LOG("ERR");
	 });
    }
    return this;
}

console.log("999-999-999");
