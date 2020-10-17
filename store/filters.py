import  django_filters
from django_filters import DateFilter
from .models import *

class OrderFilter(django_filters.FilterSet):
    start_date = DateFilter(field_name="date_added", lookup_expr='gte')
    end_date = DateFilter(field_name="date_added", lookup_expr='lte')
    note = DateFilter(field_name="note", lookup_expr='icontains')
    class Meta:
        model = OrderItem
        fields = '__all__'
        exclude = ['customer', 'date_added']