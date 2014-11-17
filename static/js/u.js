var undef;
function $E(x){return document.getElementById(x.substr(1))}
function $EV(x){return $E(x).value;}
function $EH(x){return $E(x).innerHTML;}
function $$set(s,k,v){s[k]=v;return s}
function $$reset(s,k){s[k]=s['_'+k];return s}
function CE(x){return($$set(document.createElement('li'),'innerHTML',x))}
function str(x){return JSON.stringify(x)}

function ELOG(x,e){e.appendChild(CE(x))}
function DLOG(x){ELOG(x,document.body)}
LOG=DLOG;

function main(){
    var e = $E('#out');
    LOG=function(x){
	ELOG(x,e);
    };
}

function bindVar(s,n,v,w,cb) {
    "Use this to bind a new property using a functional getter/setter";
    "s = self object to bind";
    "n = name of property";
    "v (opt) = value to initialize to";
    var n0=n.substr(1);
    var SET = s[n] = function(x){return SET.set(x).sendToTarget(x).cb(x)};
    SET.set         =function(x){s[n0]=x;return SET};
    SET.cb          =function(x){if(cb)cb(x);return SET};
    SET.sendToTarget=function(x){if(w)$E(w).value=x;return SET};
    SET.reset       =function(){s[n0]=s['_'+n];return SET};
    SET.clear       =function(){s[n0]=undefined;return SET};
    return SET(s['_'+n]=v);
}
function create(o) {
    function F() {}
    F.prototype = o;
    return new F();
};
//newObject = create(oldObject);
