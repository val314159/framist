var undef;
function $E(x){return document.getElementById(x.substr(1))}
function $$set(s,k,v){s[k]=v;return s}
function $$reset(s,k){s[k]=s['_'+k];return s}
function CE(x,e){return($$set(document.createElement('li'),'innerHTML',x))}
function str(x){return JSON.stringify(x)}

function ELOG(x,e){e.appendChild(CE(x,e))}
function DLOG(x){ELOG(x,document.body)}
LOG=DLOG;
function bindVar(s,n,v,w) {
    "Use this to bind a new property using a functional getter/setter";
    "s = self object to bind";
    "n = name of property";
    "v (opt) = value to initialize to";
    var n0=n.substr(1);
    var nn='_'+n;
    var SET = s[n] = function(x){
	SET.set(x);
	SET.sendToTarget(x);
	return SET;    };
    SET.set=function(x){
	s[n0]=x;
	return SET;    };
    SET.sendToTarget=function(x){
	if (w)
	    $E(w).value = x;
	return SET;    };
    SET.reset=function(){
	s[n0]=s[nn];
	return SET;    };
    SET.clear=function(){
	s[n0]=undefined;
	return SET;    };
    s[nn]=v;
    SET(v);
    return SET;
}
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};
//newObject = create(oldObject);
