function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    bindVar(self,'$wu',wu());
    if (cfg.autoStart) self.wu.toggleCxn();
    LOG('LAUNCH2============');
    self.say=function(value) {
	self.wu.send(str([0,'chat','say',[ value ]]));
    };
    self.yell=function(value) {
	self.wu.send(str([0,'chat','yell',[ value ]]));
    };
    self.whisper=function(whisperMsg, whisperTo) {
	whisperMsg = whisperMsg || $EV('#whisperMsg');
	whisperTo  = whisperTo  || $EV('#whisperTo');
	if (whisperTo && whisperMsg)
	    self.wu.send(str([0,'chat','whisper',[ whisperTo, whisperMsg ]]));
    };
}