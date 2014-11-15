function wu(){
    if (this===window) return new wu();
    var self=this;

    bindVar(self,'name','?');
    bindVar(self,'$ws');

    self.send_data=function(data){
	LOG(":DATA:"+data);
	LOG(":WSOCK:"+self.$ws());
	self.$ws().send_data("QAZ");
    };
}
