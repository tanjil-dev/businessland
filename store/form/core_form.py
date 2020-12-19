from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms

from store.models import *


class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class UpdateOrderForm(forms.Form):
    STATUS = (
        ('Pending', 'Pending'),
        ('Out for delivery', 'Out for delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled')
    )

    order_status = forms.ChoiceField(choices=STATUS,
                                     widget=forms.Select(attrs={'class': 'form-control', 'id': 'issue-status'}),
                                     label='place your status')

class OrderForm(ModelForm):
    class Meta:
        model = OrderItem
        fields = ['status',]

class AddOrderItemForm(ModelForm):
    class Meta:
        model = OrderItem
        fields = ['product', 'status', 'order', 'customer', 'note', 'quantity']

class AddProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['name','brand', 'description', 'digital', 'image', 'price']

