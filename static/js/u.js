function LOG1(x){document.body.innerHTML+='<li>'+str(x)+'</li>'}
function LOG(x){
    var elt = document.createElement('li');
    elt.appendChild(document.createTextNode(x));
    document.body.appendChild(elt);
}
function str(x){return JSON.stringify(x)}
