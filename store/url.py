from django.urls import path

from store.views.core_view import *

urlpatterns = [
    path('', UnderConstruction.as_view(), name="under_construction"),
    path('store/', Store.as_view(), name="store"),
    path('cart/', Cart.as_view(), name="cart"),
    path('checkout/', Checkout.as_view(), name="checkout"),
    path('update_item/', updateItem.as_view(), name="update_item"),
    path('process_order/', processOrder.as_view(), name="process_order"),
]
