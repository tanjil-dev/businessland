from rest_framework.views import APIView
from django.http import JsonResponse

from store.serializers.core_serializer import SuggestionSerializer
from store.utilities.api_return_format import GenericAPIReturnFormat
from store.exceptions.custom_exception import GenericCustomException
from store.models import *


class SearchAPI(APIView):
    message = None
    errors = None

    status_code = 400

    def get(self, request, *args, **kwargs):
        term = request.GET.get('term', None)
        serializer = SuggestionSerializer(data={'term': term})
        if serializer.is_valid():
            data = []
            self.message = "Success"
            self.status_code = 200
            names = Product.objects.filter(name__istartswith=serializer.validated_data['term'])
            for name in names:
                data.append(name.name)
            return JsonResponse(
                data=GenericAPIReturnFormat(message=self.message, status_code=self.status_code, data=data,
                                            errors=self.errors))
        else:
            self.message = 'Failed'
            self.errors = 'Data not found'
            self.status_code = 400
            raise GenericCustomException(message=self.message, status_code=self.status_code, data=self.data,
                                         errors=self.errors)
