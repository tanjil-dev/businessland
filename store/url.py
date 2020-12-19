from django.urls import path
from django.conf.urls import url
from store.api.core_api import SearchAPI
from store.views.core_view import *

urlpatterns = [
    path('uder-construction/', UnderConstruction.as_view(), name="under_construction"),
    path('', Store.as_view(), name="store"),
    path('admin_panel/', adminPanel.as_view(), name="admin_panel"),
    path('customer/<str:pk>/', customerPanel.as_view(), name="customer"),
    path('product/', ProductView.as_view(), name="product"),
    path('orders/', orders.as_view(), name="orders"),
    path('update_order/<str:pk>/', updateOrder, name="update_order"),
    path('delete_order/<str:pk>/', deleteOrder, name="delete_order"),
    path('product_view/<str:pk>/', viewProduct.as_view(), name="product_view"),
    path('cart/', Cart.as_view(), name="cart"),
    path('checkout/', Checkout.as_view(), name="checkout"),
    path('update_item/', updateItem.as_view(), name="update_item"),
    path('process_order/', processOrder.as_view(), name="process_order"),
    path('login/', loginPage.as_view(), name="login"),
    path('logout/', logOut.as_view(), name="logout"),
    path('register/', registerPage.as_view(), name="register"),
    path('demo/', demo.as_view(), name="demo"),
    path('search-result/', SearchProducts.as_view(), name="search-result"),
    path('add-order-item/', AddOrderItem.as_view(), name="add-order-item"),
    path('add-product-item/', AddProduct.as_view(), name="add-product-item"),

    # API
    url(r'^api/search$', SearchAPI.as_view(),
         name='search'),
]
