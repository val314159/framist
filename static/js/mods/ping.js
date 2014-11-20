LOG("Loading ping.js");
function Ping(){
    if (this===window) return new Ping();
    var self=this;
    self.type='ping';
    var ws;
    self.websock=function(_ws){ws=_ws;return self};
    self.addSpeaker=self.websock;}
