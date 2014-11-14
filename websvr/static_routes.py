import os,sys,traceback as tb,gevent,bottle
from app import app

@app.route('/')
def index():
    return bottle.static_file('index.html', root='./static')

@app.route('/js/<filename>')
def server_static(filename):
    return bottle.static_file(filename, root='./static/js')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return bottle.static_file(filepath, root='./static')
