LOG("Loading ps2.js")
function PubSub(){
    if(this===window)return new PubSub()
    var self=this
    var ws
    self.$open =function(k,v,msg){ LOG("PSCHAT $OPEN"+str(k)+str(v)+msg) }
    self.$close=function(){ LOG("PSCHAT $CLOSE")
			    LOG("reloading page in 5 secs...")
			    setTimeout(function(){location.reload()},5000)}
    self.$error=function(){ LOG("PSCHAT $ERROR") }
    self.$unknown=function(a,b,c){ LOG("PSCHAT $UNKNOWN:"+[str(b),c]) }
    //////////////////////////////////////////////////////////////////////////
    self._execCmd=function(cmd){
	var cmd_ch=cmd[0]
	if(cmd_ch=="S") {
	    var arr = cmd.substr(1).split(' ');
	    self.sendEnc({method:'sub',params:{subs:arr}})
	}else if(cmd_ch=="P") {
	    var subcmd = cmd.substr(1);
	    var ndx = subcmd.indexOf(' ')
	    var key = subcmd.substr(0,ndx)
	    var subcmd2= subcmd.substr(ndx+1)
	    var ndx2 = subcmd2.indexOf(' ')
	    var key2 = subcmd2.substr(0,ndx2)
	    var val2 = subcmd2.substr(ndx2+1)
	    var params={channel:key,data:val2,type:key2}
	    self.sendEnc({method:'pub',params:params})
	}else LOG("BAD COMMAND:"+cmd)
    }
    self.websock=function(_ws){ws=_ws;return self}}
