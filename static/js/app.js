function App(cfg) {
    if (this===window) return new App(cfg);
    var self=this;
    LOG('LAUNCH============');
    bindVar(self,'$ws',ws());
    bindVar(self,'$wu',wu());
    var _ws = self.$ws();
    var _wu = self.$wu();
    _wu.$ws(_ws);
    _ws.$wu(_wu);
    if (cfg.autoStart) self.$ws().toggleCxn();
    LOG('LAUNCH2============');
}
