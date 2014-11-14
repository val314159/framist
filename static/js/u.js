function $$set(s,k,v){s[k]=v;return s}
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
    var nn='_'+n;
    s['_'+nn]=s[nn]=v;
    s[n]=function(x){
	if (x===undefined)
	    return s[nn];
	s[nn]=x;
    };
}
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};
//newObject = create(oldObject);
