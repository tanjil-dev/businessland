import json
import datetime

from django.views import View
from django.shortcuts import render
from django.http import JsonResponse

from store.models import *
from store.utilities.utils import *

class UnderConstruction(View):
    template = 'store/coming_soon.html'
    def get(self, request):
        context = {}
        return render(request, template_name=self.template, context=context)

class Store(View):
    template = 'store/store.html'
    def get(self, request):
        data = cartData(request)
        cartItems = data['cartItems']

        products = Product.objects.all()
        context = {
            'products': products,
            'cartItems': cartItems
        }
        return render(request, template_name=self.template, context=context)

class Cart(View):
    template = 'store/cart.html'
    def get(self, request):
        data = cartData(request)
        cartItems = data['cartItems']
        order = data['order']
        items = data['items']

        context = {
            'items': items,
            'order': order,
            'cartItems': cartItems
        }
        return render(request, template_name=self.template , context=context)


class Checkout(View):
    template = 'store/checkout.html'
    from django.views.decorators.csrf import csrf_exempt

    @csrf_exempt
    def get(self, request):
        data = cartData(request)
        cartItems = data['cartItems']
        order = data['order']
        items = data['items']
        context = {
            'items': items,
            'order': order,
            'cartItems': cartItems
        }
        return render(request, template_name=self.template, context=context)

class updateItem(View):
    def post(self, request):
        data = json.loads(request.body)
        productId = data['productId']
        action = data['action']

        print('Action', action)
        print('productId', productId)

        customer = request.user.customer
        product = Product.objects.get(id=productId)
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

        orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

        if action == 'add':
            orderItem.quantity = (orderItem.quantity + 1)
        elif action == 'remove':
            orderItem.quantity = (orderItem.quantity - 1)

        orderItem.save()

        if orderItem.quantity <=0:
            orderItem.delete()

        return JsonResponse('Item was added', safe=False)



class processOrder(View):
    from django.views.decorators.csrf import csrf_exempt

    @csrf_exempt
    def post(self, request):
        transaction_id = datetime.datetime.now().timestamp()
        data = json.loads(request.body)
        
        if request.user.is_authenticated:
            customer = request.user.customer
            order, created = Order.objects.get_or_create(customer=customer, complete=False)

        else:
            customer, order = guestOrder(request, data)

        total = float(data['form']['total'])
        order.transaction_id = transaction_id

        if total == float(order.get_cart_total):
            order.complete = True
        order.save()

        if order.shipping == True:
            ShippingAddress.objects.create(
                customer=customer,
                order=order,
                address=data['shipping']['address'],
                city=data['shipping']['city'],
                state=data['shipping']['state'],
                zipcode=data['shipping']['zipcode'],

            )

        return JsonResponse('Payment complete', safe=False)

