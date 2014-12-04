import os,json
class FilesystemMixin:
    def h_fs_get(_,path,eltName):
        from stat import S_ISDIR
        data = (open(path).read()
                if not S_ISDIR(os.stat(path).st_mode)
                else [(p,S_ISDIR(os.stat(path+'/'+p).st_mode))
                        for p in os.listdir(path)])
        _.ws.send(json.dumps({"result":[path,data,eltName]}))
        pass
    def h_fs_put(_,path,data):
        f=open(path,'w')
        for x in data: f.write(x)
        f.close()
        pass
    def h_fs_mkdir (_,path): os.mkdir(path)
    def h_fs_rmdir (_,path): os.rmdir(path)
    def h_fs_touch (_,path): open(path,'w').close()
    def h_fs_unlink(_,path): os.unlink(path)
    pass
class FsApp(FilesystemMixin):
    def __init__(_,ws):_.ws=ws
