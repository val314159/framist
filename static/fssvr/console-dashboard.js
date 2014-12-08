//<script>
var inside=true;
$(document).keydown(function(evt){
	LOG("KK" + evt.keyCode);
	if (evt.keyCode==83 && evt.ctrlKey){
		evt.preventDefault();
		savex();
		alert("save kicked off");
	} else if (inside && evt.keyCode==49 && evt.shiftKey) {
		evt.preventDefault();
		system();
	} else if (evt.keyCode==82 && evt.ctrlKey) {
		rebootx();
	} else if (evt.keyCode==76 && evt.ctrlKey) {
		reconnectx();
	} else if (evt.keyCode==65 && evt.ctrlKey) {
		LOG("EAT IT MAYBE");
	}
});
function LOG(x){console.log(x)}
$("#edit").focus(function(){inside=true })
$("#edit").blur( function(){inside=false})
$("#edit").keydown(function(e){
	if(e.keyCode==9){
	LOG("O NOES " + e.ctrlKey + e.altKey + e.metaKey);
		if (e.altKey  || e.metaKey) {
			e.preventDefault();
			document.execCommand("InsertHTML",false,"&#09;");
		}
	}
})
//////////////////////////////////////////////////////////////////
function str(x){return JSON.stringify(x)}
function $E(x){return document.getElementById(x.substr(1))}
function $H(x){return $E(x).innerHTML} 
function $V(x){return $E(x).value} 
function $I(e,y){e.innerHTML=y;return e} 
function LOG(x){document.body.appendChild($I(document.createElement("li"),x))}
function APPEND(e,x){e.appendChild($I(document.createElement("li"),x))}
var ws;
var getId = function(){
	var _id=1000;
	return function(){return _id++;}
}();
function send(x){
	try{
		ws.send(x)
	} catch (e) {
		LOG("SEND ERR:"+e)
	}
}
function go_to2(x){
	go_to($E("#path").value + '/' + x);
}
function go_to(x){    
	LOG("Go To " +x);
	$E("#path").value = x;
	loadx();
}
function updir(){
	go_to2('..');
}
function system(){
	LOG("SYSTEM");
	var cmd = prompt("Enter system command:","");
	LOG("SYSTEM:"+str(cmd));
        var path=$V("#path");
	fs_system(cmd,"#edit",path);
}
function mkdir(){
	LOG("MKDIR");
	var dirname = prompt("Enter directory name to create:","");
	LOG("MKDIR:"+str(dirname));
	var path=$V("#path");
	fs_mkdir(path+'/'+dirname);
	setTimeout(function(){loadx()},50);
}
function touch(){
	LOG("TOUCH");
	var dirname = prompt("Enter filename to create:","");
	LOG("TOUCH:"+str(dirname));
	var path=$V("#path");
	fs_touch(path+'/'+dirname);
	setTimeout(function(){loadx()},50);
}
function rmdir(){
	LOG("RMDIR");
	var dirname = prompt("Enter name to remove:","");
	var path=$V("#path");
	fs_rmdir(path+'/'+dirname);
	setTimeout(function(){loadx()},50);
}

function fs_get(path,eltName){         send(str({"method":"fs_get","params":[path,eltName]}))}
function fs_put(path,data){            send(str({"method":"fs_put","params":[path,data]}))}
function fs_mkdir(path){               send(str({"method":"fs_mkdir","params":[path]}))}
function fs_system(path,eltName,cwd){  send(str({"method":"fs_system","params":[path,eltName,cwd]}))}
function fs_rmdir(path){               send(str({"method":"fs_rmdir","params":[path]}))}
function fs_touch(path){               send(str({"method":"fs_touch","params":[path]}))}
function fs_unlink(path){              send(str({"method":"fs_unlink","params":[path]}))}

function reconnectx(){
	ws = new WebSocket("ws://localhost:8383/ws/fs");
	ws.onopen=function(e){
		LOG("OPN:"+e);
		loadx();
		LOG("OPN2:"+e);
	}
	ws.onclose=function(x){  LOG("CLS:"+x); }
	ws.onerror=function(x){  LOG("ERR:"+x); }
	ws.onmessage=function(x){
		LOG("MSG:"+x.data);
		m=JSON.parse(x.data);
		//LOG(m.result[1]);
		var text=m.result[1];
		var elt = $E(m.result[2]);
		if(m.method=="fs_system"){
			LOG("ITS A SYSTEM THANG" + str(m.result));
			elt.innerHTML = text[0] + '<hr>' + text[1];
		}else if(typeof(text)=="string"){
			text = text.replace(/  /g,' &nbsp;');
			text = text.replace(/\n/g,'<br>');
			elt.innerHTML = text;
			elt.contentEditable=true;
			elt.onkeydown=function(e){
				if(e.keyCode==9){
					e.preventDefault();
					document.execCommand("InsertHTML",false,"&#09;");
				}
			}
		} else {
			elt.innerHTML = "";
			var s3 = '<a onclick="updir()">..</a>';
			APPEND(elt,s3);
			for (var n=0;n<text.length;n++) {
				var v=text[n][0];
				var v2=v;
				if (text[n][1])
					v2 += '/';
				var s = "<a xhref='/f?path="+v+"' onclick=go_to2('"+v+"') >"+v2+"</a>";
				APPEND(elt,s);
			}
			elt.contentEditable=false;
		}
	}
}

function savex(){
	var text = $H("#edit");
	text = text.replace(/\<\/div\>/g,'');
	text = text.replace(/\<div\>/g,'\n');
	text = text.replace(/\<br\>/g,'\n');
	text = text.replace(/&nbsp;/g,' ');
	fs_put($V("#path"),[text]); }
function loadx(){ fs_get($V("#path"),"#edit"); }
function rebootx(){
	var cfg = {url: 'http://localhost:8282/stop'};
	$.ajax(cfg).then(function(){
		LOG("YES");
	},function(){
		LOG("NO");
	})}

reconnectx();
//</script>
