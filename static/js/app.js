
function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    bindVar(self,'$ws',ws());
    if (cfg.autoStart) self.$ws().toggleCxn();
    LOG('LAUNCH2============');

    self.say=say(value) {
	LOG("QQ:"+app.$ws().$name());
	LOG("Q@:"+value);
	_ws.send(str([0,'chat','message',
		      [ app.$ws().$name(), value ]]));
	LOG("QQ________");
    };
}
