from django.urls import path

from store.views.core_view import *

urlpatterns = [
    path('uder-construction/', UnderConstruction.as_view(), name="under_construction"),
    path('', Store.as_view(), name="store"),
    path('orders/', orders.as_view(), name="orders"),
    path('product_view/<str:pk>/', viewProduct.as_view(), name="product_view"),
    path('cart/', Cart.as_view(), name="cart"),
    path('checkout/', Checkout.as_view(), name="checkout"),
    path('update_item/', updateItem.as_view(), name="update_item"),
    path('process_order/', processOrder.as_view(), name="process_order"),
    path('login/', loginPage.as_view(), name="login"),
    path('register/', registerPage.as_view(), name="register"),
    path('demo/', demo.as_view(), name="demo"),
]
