function $E(x){return document.getElementById(x.substr(1));}
var ScrollToBottom=function(e){
    setTimeout(function(){e.scrollTop(e.height())}, 1000);
};
var LOG=function(x){
    var e=$E('#out');
    e.innerHTML += "<li>"+x+"</li>";
    ScrollToBottom($('#outs'))};
CLR=function(){$E('#out').innerHTML("")};
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
fmt=__format__();
