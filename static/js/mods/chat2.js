LOG("Loading chat2.js");
function Chat(){
    if(this===window)return new Chat();
    var self=this;
    var ws;
    self.userInfo = {};
    self.users = {};
    initial_msg='HEY I JUST ARRIVED IM A NEWBIE PLEASE HELP ME IM SO SADD'

    self.$open =function(k,v,msg){
	LOG("CHAT $OPEN");
	self.sendEnc({method:'intro',params:{}})
    };
    self.$close=function(){ LOG("CHAT $CLOSE");
			    LOG("reloading page in 5 secs...");
			    setTimeout(function(){
			    location.reload();
				},5000);

 };
    self.$error=function(){ LOG("CHAT $ERROR"); };
    self.$unknown=function(a,b,c){ LOG("CHAT $UNKNOWN:"+[str(b),c]); };
    self.say=function(websock,msg){
	//LOG("CHAT SAY"+str(msg));
	if(msg.channel=='y'){
	    LOG("(* "+str(msg.from.name)+" *) "+msg.msg);
	}else if(msg.channel=='s'){
	    LOG("*> "+msg.msg);
	}else if(msg.channel[0]=='s'){
	    LOG("(~p, "+str(msg.from.name)+"~) "+msg.msg);
	}else if(msg.channel[0]=='~'){
	    LOG("( "+str(msg.from.name)+" ) "+msg.msg);
	}else{
	    LOG("WTF:"+msg);
	}
	if(msg.from.sid==self.userInfo.sid) {
	    //LOG("CHAT SAY"+str(msg.from.sid)+self.userInfo.sid);
	    //websock.close();
	}
    };
    self.connect=function(websock,msg){
	LOG(">> New Connection ("+msg.name+") on "+str(msg.channels[0]));
	self.users[msg.sid] = msg;
	/*
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:self.userInfo.channels[0]}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'y'}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'s'}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'noway'}})
	self.sendEnc({method:'whoList',params:{}})
	*/
    };
    self.whoList=function(websock,msg){
	LOG(">> Who list:");
	var n=0;
	loop(msg['whoList'],function(k,v){
		n++;
		LOG(" -- "+str(v));
		self.sendEnc({method:'say',params:{msg:initial_msg,channel:v.sid}})
	    });
	LOG(" >> " + n + " user(s).");
    };
    self.execCmd=function(cmd){
	LOG("CHAT EXEC CMD"+str(cmd));
	var ch=cmd[0];
	var cmd_ch=cmd[1];
	if(ch=="\""||ch=="\'"){
	    //LOG("SEND A SAY");
	    self.sendEnc({method:'say',params:{msg:cmd.substr(2),
			    channel:self.userInfo.channels[0]}})
	}else if(ch==":"||ch==";"){
	    //LOG("SEND A EMOTE");
	    self.sendEnc({method:'say',params:{msg:cmd.substr(1),
			    channel:self.userInfo.channels[0]}})
	}else if(ch!="."){
	    LOG("BAD COMMAND:"+cmd);

	}else if(cmd_ch=="w") {
	    //LOG("SEND A WHO");
	    self.sendEnc({method:'whoList',params:{}})
	}else if(cmd_ch=="y") {
	    //LOG("SEND A YELL");
	    self.sendEnc({method:'say',params:{msg:cmd.substr(2),channel:'y'}})
	}else if(cmd_ch=="p") {
	    //LOG("SEND A WHISPER");
	    var sub_cmd = cmd.substr(2);
	    LOG("SUBCMD " + str(sub_cmd));
	    var arr = sub_cmd.split(',',2);
	    LOG("ARR " + str(arr));
	    self.sendEnc({method:'say',params:{msg:arr[1],channel:arr[0]}})
	}else if(cmd_ch=="s") {
	    //LOG("SEND A SYSTEM MSG");
	    self.sendEnc({method:'say',params:{msg:cmd.substr(2),channel:'s'}})
	}else if(cmd_ch=="q") {
	    //LOG("SEND A QUIT MSG");
	    //LOG("what's quit mean right now?");
	    self.sendEnc({method:'quit',params:{msg:cmd.substr(2)}})
	}else{
	    LOG("BAD COMMAND:"+cmd);
	}
    };
    self.hello=function(websock,msg){
	LOG("CHAT HELLO"+str(msg));
	self.userInfo = msg;
	self.sendEnc({method:'connect',params:{}})
    };
    self.websock=function(_ws){ws=_ws;return self}}
//e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)
function getChar(event) {
    if (event.which == null) {
	return String.fromCharCode(event.keyCode); // IE
    } else if (event.which!=0 && event.charCode!=0) {
	return String.fromCharCode(event.which);   // the rest
    } else {
	return null; // special key
    }
}
