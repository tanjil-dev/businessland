from rest_framework.exceptions import APIException
from store.utilities.api_return_format import GenericAPIReturnFormat

class GenericCustomException(APIException):
    status_code = 400
    default_detail = "An error occurred."
    default_code = 'invalid'

    def __init__(self, message, status_code, errors=None, data=None):
        self.status_code = status_code
        self.detail = GenericAPIReturnFormat(message=message, status_code=status_code, errors=errors, data=data)