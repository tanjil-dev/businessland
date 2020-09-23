from django.contrib import admin

# Register your models here.

from .models import *
# name = None
# price = None
# if User.is_superuser:
#     name = Product.objects.values('name')
# else:
#     price = Product.objects.values('price')

admin.site.register(Customer)
admin.site.register(Product)
# admin.site.register(Product.name)
# admin.site.register(Product.price)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
