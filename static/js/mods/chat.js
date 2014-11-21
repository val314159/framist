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
    self.connect=function(websock,msg){
	LOG("CHAT CONNECT"+str(msg));
	self.users[msg.sid] = msg;
	LOG("YCHAT CONNECT"+str(msg));
	self.sendEnc({method:'whoList',params:{pattern:'testval'}})
	LOG("ZCHAT CONNECT"+str(msg));
    };
    self.hello=function(websock,msg){
	LOG("CHAT HELLO"+str(msg));
	self.userInfo = msg;
	LOG("YCHAT HELLO"+str(msg));
	self.sendEnc({method:'connect',params:{}})
	LOG("ZCHAT HELLO=============");
	//self.sendEnc({method:'say',params:{msg:initial_msg,channel:self.userInfo.channels[1]}})
	LOG("W1 CHAT HELLO============");
	//self.sendEnc({method:'say',params:{msg:initial_msg,channel:self.userInfo.channels[0]}})
	LOG("W2 CHAT HELLO============");
	//self.sendEnc({method:'say',params:{msg:initial_msg,channel:'y'}})
	LOG("W3 CHAT HELLO============");
	//self.sendEnc({method:'say',params:{msg:initial_msg,channel:'s'}})
	LOG("W4 CHAT HELLO============");
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
