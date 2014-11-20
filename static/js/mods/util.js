G={};
function $E(x){return document.getElementById(x.substr(1))};
function LOG(x){$E('#out').innerHTML+="<li>"+x+"</li>"}
LOG("Loading util.js");
str=function(x){return(x===window)?"[WINDOW]":JSON.stringify(x);}
LOG.clear=function(){$E('#out').innerHTML=''};
function EXC(x,dontClear){CMD(x.value);if(!dontClear)x.value=''}
function CMD(x){LOG("CMD:"+x)}
