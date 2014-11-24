LOG("Loading chat2.js")
function Chat(){
    if(this===window)return new Chat()
    var self=this
    var ws
    self.userInfo = {}
    self.users = {}
    initial_msg='HEY I JUST ARRIVED IM A NEWBIE PLEASE HELP ME IM SO SADD'

    self.$open =function(k,v,msg){
	LOG("CHAT $OPEN"+str(k)+str(v)+msg)
	self.sendEnc({method:'intro',params:{}})
    }
    self.hello=function(websock,msg){
	LOG("CHAT HELLO"+str(msg))
	self.userInfo = msg
	self.Writer().makeConnection()
    }
    self.$close=function(){ LOG("CHAT $CLOSE")
			    LOG("reloading page in 5 secs...")
			    setTimeout(function(){
				location.reload()
			    },5000)
			  }
    self.$error=function(){ LOG("CHAT $ERROR") }
    self.intro=function(a,b){
	LOG("Intro:<hr><pre>"+(b.message)+"</pre><hr>")
    }
    self.disconnect=function(a,b,c){ LOG("CHAT DISCONNECT:"+str(b)) }
    self.$unknown=function(a,b,c){ LOG("CHAT $UNKNOWN:"+[str(b),c]) }
    self.pub=function(websock,msg){
	var name = msg.from.name.substr(1)
	//LOG("PUB:"+str(name)+" *) "+msg.msg)
	if(msg.channel=='y')
	    LOG("(* "+name+" *) "+msg.msg)
	else if(msg.channel=='s')
	    LOG("*> "+msg.msg)
	else if(msg.channel[0]=='s')
	    LOG("(~p, "+name+"~) "+msg.msg)
	else if(msg.channel[0]=='n')
	    LOG("(~n, "+name+"~) "+msg.msg)
	else if(msg.channel[0]=='~')
	    LOG("( "+name+" ) "+msg.msg)
	else
	    LOG("WTF:"+msg)	
	if(msg.from.sid==self.userInfo.sid) {
	    //LOG("CHAT PUB"+str(msg.from.sid)+self.userInfo.sid)
	    //websock.close()
	}
    }
    self.connect=function(websock,msg){
	//LOG("CHAT CONNECT")
	LOG(">> New Connection ("+msg.name+") on "+str(msg.channels[0]))
	if(msg.from.sid==self.userInfo.sid) {
	    LOG(">> HEY ITS ME!!!!!!")
	}
	self.users[msg.sid] = msg
    }
    self.whoList=function(websock,msg){
	LOG(">> Who list:")
	var results=msg.params.results;
	for (var i=0; i<results.length; i++) {
	    LOG(" &nbsp;&nbsp;- "+i+": "+str(results[i]))
	}
	LOG(" >> " + i + " user(s).")
    }
    ////////////////////////////////////////////////////////////////////////////
    self._channel=function(){return self.userInfo.channels[0]}
    self._sid    =function(){return self.userInfo.channels[1]}
    self._name   =function(){return self.userInfo.channels[2]}
    self.Writer  =function(){
	if (this===self) return new self.Writer()
	this.whoList=function(){ self.sendEnc({method:'whoList',params:{}}) }
	this.pub=function(ch,msg){	    self.sendEnc({method:'pub',params:{msg:msg,channel:ch,from:{name:self._name(),id:self._sid()}}})	}
	this.quit   =function(msg){	    self.sendEnc({method:'disconnect',params:{msg:msg,from:{name:self._name(),id:self._sid()}}})	}
	this.whisper=function(to,msg){	    this.pub(to,msg)	}
	this.yell   =function(msg){	    this.pub('y',msg)	}
	this.say    =function(msg){	    this.pub(self._channel(),msg)	}
	this.sysmsg =function(msg){	    this.pub('s',msg)	}

	this.makeConnection=function(){
	    LOG("CHAT MAKE CONNECTION")
	    self.sendEnc({method:'connect',params:{channels:self.userInfo.channels}})
	}
    }
    self._execCmd=function(cmd){
	//LOG("CHAT EXEC CMD"+str(cmd))
	var ch=cmd[0]
	var cmd_ch=cmd[1]
	if(ch=="\""||ch=="\'"){
	    self.Writer().say(cmd)
	}else if(ch==":"||ch==";"){
	    self.Writer().say(cmd)
	}else if(ch!="."){
	    LOG("BAD COMMAND:"+cmd)
	}else if(cmd_ch=="w") {
	    self.Writer().whoList()
	}else if(cmd_ch=="y") {
	    self.Writer().yell(cmd.substr(2))
	}else if(cmd_ch=="p") {
	    var subcmd = cmd.substr(2);
	    var ndx = subcmd.indexOf(' ')
	    var to = subcmd.substr(0,ndx)
	    var rest = subcmd.substr(ndx+1)
	    self.Writer().whisper(to,rest)
	}else if(cmd_ch=="s") {
	    self.Writer().sysmsg(cmd.substr(2))
	}else if(cmd_ch=="q") {
	    self.Writer().quit(cmd.substr(2))
	}else LOG("BAD COMMAND:"+cmd)
    }
    self.websock=function(_ws){ws=_ws;return self}}
//e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)
function getChar(event) {
    if (event.which == null) {
	return String.fromCharCode(event.keyCode) // IE
    } else if (event.which!=0 && event.charCode!=0) {
	return String.fromCharCode(event.which)   // the rest
    } else {
	return null // special key
    }
}
