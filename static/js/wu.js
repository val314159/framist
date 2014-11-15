function wu(){
    if (this===window) return new wu();
    var self=this;

    bindVar(self,'name','?');
    bindVar(self,'$ws');

    self.send=function(data){
	LOG(":DATA:"+data);
	LOG(":WSOCK:"+self.$ws());
	self.$ws().send("QAZ");
    };
}
