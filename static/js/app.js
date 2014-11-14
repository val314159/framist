var WS;
function reconnect() {
    LOG('RECONNECT');
    WS=new ws();
}
function clicky() {
    LOG('CLICKY');
    WS.reconnectDelay(0);
    WS.close();
}
