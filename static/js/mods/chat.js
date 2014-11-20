LOG("Loading chat.js");
function Chat(o){
    if(this===window)return new Chat();
    var self=this;
    var ws;
    self.$open =function(){ LOG("CHAT $OPEN");  };
    self.$close=function(){ LOG("CHAT $CLOSE"); };
    self.$error=function(){ LOG("CHAT $ERROR"); };
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
