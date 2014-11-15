function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    bindVar(self,'$wu',wu());
    if (cfg.autoStart) self.wu.toggleCxn();
    LOG('LAUNCH2============');

    self.set_channel=function(value) {
	LOG("QQ:"+app.wu.name);
	LOG("Q@:"+value);
	self.wu.$channel(value);
	self.wu.send(str([0,'chat','channel',
			  [ value ]]));
	LOG("QQ________");
    };
    self.say=function(value) {
	LOG("QQ:"+app.wu.name);
	LOG("Q@:"+value);
	self.wu.send(str([0,'chat','message',
			  [ app.wu.name, value ]]));
	LOG("QQ________");
    };
}
