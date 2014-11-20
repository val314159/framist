LOG("Loading chat.js");
function Chat(o){
    if(this===window)return new Chat();
    var self=this;
    var ws;
    self.websock=function(_ws){ws=_ws;return self}}
