LOG("Loading chat.js");
function Chat(){
    if (this===window) return new Chat();
    var self=this;
    self.type='chat';
    var ws;
    self.websock=function(_ws){ws=_ws;return self};
    self.addSpeaker=self.websock;}
