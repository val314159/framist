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
    self.$unknown=function(a,b,c){ LOG("CHAT $UNKNOWN:"+[str(b),c]) }
    self.pub=function(websock,msg){
	if(msg.channel=='y'){
	    LOG("(* "+str(msg.from.name)+" *) "+msg.msg)
	}else if(msg.channel=='s'){
	    LOG("*> "+msg.msg)
	}else if(msg.channel[0]=='s'){
	    LOG("(~p, "+str(msg.from.name)+"~) "+msg.msg)
	}else if(msg.channel[0]=='~'){
	    LOG("( "+str(msg.from.name)+" ) "+msg.msg)
	}else{
	    LOG("WTF:"+msg)
	}
	if(msg.from.sid==self.userInfo.sid) {
	    //LOG("CHAT PUB"+str(msg.from.sid)+self.userInfo.sid)
	    //websock.close()
	}
    }
    self.connect=function(websock,msg){
	LOG("CHAT CONNECT")
	LOG(">> New Connection ("+msg.name+") on "+str(msg.channels[0]))
	if(msg.from.sid==self.userInfo.sid) {
	    LOG(">> HEY ITS ME!!!!!!")
	}
	self.users[msg.sid] = msg
    }
    self.whoList=function(websock,msg){
	LOG(">> Who list:")
	var n=0
	loop(msg['whoList'],function(k,v){
		n++
		LOG(" -- "+str(v))
		self.sendEnc({method:'say',params:{msg:initial_msg,channel:v.sid}})
	    })
	LOG(" >> " + n + " user(s).")
    }
    self.execCmd=function(cmd){
	LOG("CHAT EXEC CMD"+str(cmd))
	var ch=cmd[0]
	var cmd_ch=cmd[1]
	if(ch=="\""||ch=="\'"){
	    self.sendEnc({method:'pub',params:{msg:cmd.substr(2),
			    channel:self.userInfo.channels[0]}})
	}else if(ch==":"||ch==";"){
	    self.sendEnc({method:'pub',params:{msg:cmd.substr(1),
			    channel:self.userInfo.channels[0]}})
	}else if(ch!="."){
	    LOG("BAD COMMAND:"+cmd)

	}else if(cmd_ch=="w") {
	    self.sendEnc({method:'whoList',params:{}})
	}else if(cmd_ch=="y") {
	    self.sendEnc({method:'pub',params:{msg:cmd.substr(2),channel:'y'}})
	}else if(cmd_ch=="p") {
	    var sub_cmd = cmd.substr(2)
	    LOG("SUBCMD " + str(sub_cmd))
	    var arr = sub_cmd.split(',',2)
	    LOG("ARR " + str(arr))
	    self.sendEnc({method:'pub',params:{msg:arr[1],channel:arr[0]}})
	}else if(cmd_ch=="s") {
	    self.sendEnc({method:'pub',params:{msg:cmd.substr(2),channel:'s'}})
	}else if(cmd_ch=="q") {
	    self.sendEnc({method:'quit',params:{msg:cmd.substr(2)}})
	}else{
	    LOG("BAD COMMAND:"+cmd)
	}
    }
    self.hello=function(websock,msg){
	LOG("CHAT HELLO"+str(msg))
	self.userInfo = msg
	self.makeConnection()
    }
    self.makeConnection=function(){
	LOG("CHAT MAKE CONNECTION")
	self.sendEnc({method:'connect',params:{
	    channels:self.userInfo.channels
	}})
    }
    self.breakConnection=function(){
	LOG("CHAT BREAK CONNECTION")
	self.sendEnc({method:'disconnect',params:{message:"so long!"}})
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
