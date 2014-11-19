undef=undefined;
function ChatApp(self){
    if (self===undef) {
	if (this===window || this===undef)
	    return new ChatApp();
	self=this;
    }
    self.execCmd=function(cmd){
	if (cmd=="connect") {
	    LOG("CONNECT IT");
	    self.connect();
	}
	return self;
    };
    self.connect=function(cmd){
	LOG("CONNECT IT FOR REAL");
	return self;
    };
}
