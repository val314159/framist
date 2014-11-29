function $E(x){return document.getElementById(x.substr(1));}
function ScrollToBottom(e){e.scrollTop=e.scrollHeight}
var LOG=function(x){
    var e=$E('#out');
    e.innerHTML += "<li>"+x+"</li>";
    setTimeout(function(){ScrollToBottom(document.body)},0);
};
LOG("// Loading utils.js");
CLR=function(){$E('#out').innerHTML="";};
function str(x){return(x===window)?"[[[WINDOW]]]":JSON.stringify(x)}
function $GET(url) {return $.ajax({context:this,url:url})}
var $undef, $globals=this;
function create(parent) {
    function F(){}
    F.prototype = parent;
    return new F()}
function __format__() {
    var theString = arguments[0];
    for (var i=1; i<arguments.length; ++i) {
	var regEx = new RegExp("\\{"+(i-1)+"\\}", "gm");
	theString = theString.replace(regEx, arguments[i]);
    }
    return theString}
fmt=__format__;
LOG.fmt=function(){LOG(fmt.apply($undef,arguments));}
function startsWith(a,b){return(a.substr(0,b.length)==b)}
