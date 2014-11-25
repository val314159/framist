LOG("Loading ds2.js")
function Datastore(){
    if(this===window)return new Datastore()
    var self=this
    var ws
    self.$open =function(k,v,msg){	LOG("CHAT $OPEN"+str(k)+str(v)+msg) }
    self.hello=function(websock,msg){	LOG("CHAT HELLO"+str(msg))    }
    self.$close=function(){ LOG("CHAT $CLOSE")
			    LOG("reloading page in 5 secs...")
			    setTimeout(function(){
				location.reload()
			    },5000)
			  }
    self.$error=function(){ LOG("CHAT $ERROR") }
    self.$unknown=function(a,b,c){ LOG("CHAT $UNKNOWN:"+[str(b),c]) }
    //////////////////////////////////////////////////////////////////////////
    self._execCmd=function(cmd){
	var cmd_ch=cmd[1]
	if(cmd_ch=="R") {
	    var key = cmd.substr(2)
	    self.sendEnc({method:'range',params:{key:key}})
	}else if(cmd_ch=="G") {
	    var key = cmd.substr(2)
	    self.sendEnc({method:'get',  params:{key:key}})
	}else if(cmd_ch=="S") {
	    var subcmd = cmd.substr(2);
	    var ndx = subcmd.indexOf(' ')
	    var key = subcmd.substr(0,ndx)
	    var val = subcmd.substr(ndx+1)
	    self.sendEnc({method:'set',  params:{key:key,val:val}})
	}else if(cmd_ch=="P") {
	    var subcmd = cmd.substr(2);
	    var ndx = subcmd.indexOf(' ')
	    var key = subcmd.substr(0,ndx)
	    var val = subcmd.substr(ndx+1)
	    self.sendEnc({method:'put',  params:{key:key,val:val}})
	}else LOG("BAD COMMAND:"+cmd)
    }
    self.websock=function(_ws){ws=_ws;return self}}
