function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    bindVar(self,'$wu',wu());
    if (cfg.autoStart) self.wu.toggleCxn();
    LOG('LAUNCH2============');

    self.$channel=function(value) {
	self.wu.$channel(value);
	self.wu.send(str([0,'chat','channel',[ value ]]));
    };
    self.$name=function(value) {
	self.wu.$name(value);
	self.wu.send(str([0,'chat','name',[ value ]]));
    };
    self.say=function(value) {
	self.wu.send(str([0,'chat','message',[ value ]]));
    };
}
