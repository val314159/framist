LOG("Loading chat.js");
function Chat(){
    if(this===window)return new Chat();
    var self=this;
    var ws;
    self.userInfo = {};
    self.users = {};
    initial_msg='HEY I JUST ARRIVED IM A NEWBIE PLEASE HELP ME IM SO SAD'

    self.$open =function(k,v,msg){ LOG("CHAT $OPEN"); };
    self.$close=function(){ LOG("CHAT $CLOSE"); };
    self.$error=function(){ LOG("CHAT $ERROR"); };
    self.$unknown=function(a,b,c){ LOG("CHAT $UNKNOWN:"+[str(b),c]); };
    self.say=function(websock,msg){
	LOG("CHAT SAY"+str(msg));
	if(msg.from.sid==self.userInfo.sid) {
	    LOG("CHAT SAY"+str(msg.from.sid)+self.userInfo.sid);
	    //websock.close();
	}
    };
    self.connect=function(websock,msg){
	LOG("CHAT CONNECT"+str(msg));
	self.users[msg.sid] = msg;
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:self.userInfo.channels[0]}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'y'}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'s'}})
	self.sendEnc({method:'say',params:{msg:initial_msg,channel:'noway'}})
	self.sendEnc({method:'whoList',params:{}})
    };
    self.whoList=function(websock,msg){
	LOG("CHAT WHOLIST"+str(msg));
	var n=0;
	loop(msg['whoList'],function(k,v){
		n++;
		LOG(" >> "+str(v));
		self.sendEnc({method:'say',params:{msg:initial_msg,channel:v.sid}})
	    });
	LOG(" >> " + n + " user(s).");
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
