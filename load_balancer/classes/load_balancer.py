import enum
from json import JSONEncoder



class LoadBalanerMethods(enum.Enum):
    round_robin = 1
    hashed_mac  = 2
    

class LoadBalancer:
    def __init__(self , datapath , method, virtual_ip) -> None:
        self.datapath   = datapath
        self.method  = method
        self.virtual_ip = virtual_ip
        self.method_name = LoadBalanerMethods(method).name

    def __str__(self) -> str:
        dic =  {
            "method" : LoadBalanerMethods(self.method).name,
           "virtual_ip" : self.virtual_ip,
            "datapath" : self.datapath,
        }

        return str(dic)

    def __repr__(self) -> str:
        return self.__str__()
    
class LoadBalancerEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__