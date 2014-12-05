import os,json

from cgi import escape
def unescape(s):
    s = s.replace("&lt;", "<")
    s = s.replace("&gt;", ">")
    # this has to be last:
    s = s.replace("&amp;", "&")
    return s

class FilesystemMixin:
    def h_fs_get(_,path,eltName=''):
        from stat import S_ISDIR
        data = (escape(open(path).read())
                if not S_ISDIR(os.stat(path).st_mode)
                else [(p,S_ISDIR(os.stat(path+'/'+p).st_mode))
                        for p in os.listdir(path)])
        _.ws.send(json.dumps({"method":"fs_get","result":[path,data,eltName]}))
        pass
    def h_fs_put(_,path,data):
        f=open(path,'w')
        for x in data: f.write(unescape(x))
        f.close()
        pass
    def h_fs_system(_,path,eltName='',cwd=None):
        import subprocess as sp
        import shlex
        data=sp.Popen(shlex.split(path),cwd=cwd,stdout=sp.PIPE, stderr=sp.PIPE).communicate()
        _.ws.send(json.dumps({"method":"fs_system","result":[path,data,eltName]}));
        pass
    def h_fs_mkdir (_,path): os.mkdir(path)
    def h_fs_rmdir (_,path): os.rmdir(path)
    def h_fs_touch (_,path): open(path,'w').close()
    def h_fs_unlink(_,path): os.unlink(path)
    pass
class FsApp(FilesystemMixin):
    def __init__(_,ws):_.ws=ws
