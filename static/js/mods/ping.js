LOG("Loading ping.js");
function Ping(){
    if(this===window)return new Ping();
    var self=this;
    var ws;
    self.websock=function(_ws){ws=_ws;return self};
    self.send=function(data){
	data.ns=self.ns;
	ws.sendEnc(data,self.ns);
	return self};
    self.addSpeaker=self.websock;}
