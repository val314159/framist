function Console() {
    if (this===window) return new Console();
    var self=this;
    self.type='__Console__';
    self.execCmd=function(input) {
	LOG('SEND CMD: ============['+input.value+']!!!');
	input.value='';
	return self};
    self.focus = function() {
	input.focus();
	return self};
    self.bindInput = function(input) {
	input.onchange=function(){
	    self.execCmd(input);
	};
	return self};
    self._bindCmd=function(cmd){LOG("do nothing:"+cmd)};
    self.bindCmd =function(func) {
	self.func=func;
	return self};
}