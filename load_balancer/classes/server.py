from json import JSONEncoder

class Server:
    def __init__(self , ip , mac , port) -> None:
        self.ip   = ip
        self.mac  = mac
        self.port = port

    def __str__(self) -> str:
        dic =  {
            "ip" : self.ip,
            "mac" : self.mac,
            "port" : self.port
        }
        return str(dic)
    
    def __repr__(self) -> str:
        return self.__str__()

class ServerEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__