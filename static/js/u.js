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
    var w0;
    if (w)
	w0=w.substr(1);
    s[nn]=s[n0]=v;
    var SET = s[n] = function(x,y){
	if (y=='reset')
	    s[n0]=s[nn];
	else
	    s[n0]=x;
	if (w0)
	    document.getElementById(w0).value = x;
	return SET;
    };
    s[n].reset=function(){
	s[n0]=s[nn];
	return SET;
    };
    SET(v);
    return SET;
}
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};
//newObject = create(oldObject);
