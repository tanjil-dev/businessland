class GenericAPIReturnFormat(object):
    def __init__(self, message, status_code, errors, data):
        self.errors = errors
        self.status_code = status_code
        self.message = message
        self.data = data

    def __new__(cls, message, status_code, errors=None, data=None):
        return {
            'message': message,
            'status_code': status_code,
            'data': data,
            'errors': errors
        }
