from json import JSONEncoder

class LoadBalancer:
    def __init__(self , datapath , method) -> None:
        self.datapath   = datapath
        self.method  = method

    def __str__(self) -> str:
        dic =  {
            "datapath" : self.datapath,
            "method" : self.method,
        }
        return str(dic)
    
    def __repr__(self) -> str:
        return self.__str__()
    
class LoadBalancerEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__