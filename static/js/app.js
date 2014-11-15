function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    var websock=self.ws=ws();
    self.toggleCxn=function(){websock.toggleCxn()};
    if (cfg.autoStart) self.toggleCxn();
}
