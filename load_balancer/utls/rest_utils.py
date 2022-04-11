import imp
import json
from wsgiref import validate 

from ryu.app.wsgi import Response 


def create_response(body, status=200, content_type='application/json'):
    r = Response(content_type=content_type,
                                body=body, status=status)
    
    r._headerlist.append(('Access-Control-Allow-Origin', '*'))
    return r



def post_method(keywords , validators = {}):
    def _wrapper(method):
        def __wrapper(self, req, **kwargs):
            try:
                try:
                    body = req.json if req.body else {}
                except ValueError:
                    raise ValueError('Invalid syntax %s', req.body)
                kwargs.update(body)
                
                for key, converter in keywords.items():
                    value = kwargs.get(key, None)
                    if value is None:
                        raise ValueError('%s not specified' % key)
                
                for key, validator in validators.items():
                    value = kwargs.get(key , None)
                    if value is None:
                        raise ValueError('No field for validator %s' % key)
                    if not validator(value) :
                        raise ValueError('Validation failed for %s' % key)
                
                for key, converter in keywords.items():
                    value = kwargs.get(key, None)
                    kwargs[key] = converter(value)



            except ValueError as e:
                body = json.dumps(
                    {
                        "erorr" : str(e)
                    }
                )
                return create_response(body, status=400)
            try:
                return method(self, **kwargs)
            except Exception as e:
                status = 500
                body = json.dumps({
                    "error": str(e),
                    "status": status,
                })
                return create_response(body ,status=500)
        __wrapper.__doc__ = method.__doc__
        return __wrapper
    return _wrapper

