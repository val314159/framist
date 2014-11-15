function wu(wsock){
    if (this===window) return new wu(wsock);
    var self=this;

    bindVar(self,'name','?');
    bindVar(self,'wsock');

    self.send_data=function(data){
	LOG(":DATA:"+data);
	LOG(":WSOCK:"+wsock);
	wsock.send_data("QAZ");
    };
}
