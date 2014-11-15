function $$set(s,k,v){s[k]=v;return s}
function $$reset(s,k){s[k]=s['_'+k];return s}
function CE(x,e){return($$set(document.createElement('li'),'innerHTML',x))}
function str(x){return JSON.stringify(x)}

function ELOG(x,e){e.appendChild(CE(x,e))}
function DLOG(x){ELOG(x,document.body)}
LOG=DLOG;

function bindVar(s,n,v) {
    "Use this to bind a new property using a functional getter/setter";
    "s = self object to bind";
    "n = name of property";
    "v (opt) = value to initialize to";
    var n0=n.substr(1);
    var nn='_'+n;
    s['_'+nn]=s[nn]=s[n0]=v;
    s[n]=function(x,y){
	if (y=='reset') {
	    s[nn]=s[n0]=s['_'+nn];
	    return;
	}
	if (x===undefined)
	    return s[n0];
	s[n0]=s[nn]=x;
    };
}
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};
//newObject = create(oldObject);
