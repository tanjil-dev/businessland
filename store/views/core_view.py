import json
import datetime

from django.views import View
from django.shortcuts import render
from django.http import JsonResponse

from store.models import *
from store.utilities.utils import *
from django.contrib.auth.forms import UserCreationForm

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

class viewProduct(View):
    template = 'store/view_product.html'
    def get(self,request,pk):
        product = Product.objects.get(id=pk)
        context = {
            'products': product
        }
        return render(request, template_name=self.template, context=context)

class orders(View):
    template = 'store/orders.html'
    def get(self,request):
        if request.user.is_authenticated:
            order = Order.objects.all()
        else:
            order = []
        context = {
            'orders': order
        }
        return render(request, template_name=self.template, context=context)

class loginPage(View):
    template = 'store/login.html'
    def get(self, request):
        context = {}
        return render(request, template_name=self.template, context=context)

class registerPage(View):
    template = 'store/register.html'
    form = UserCreationForm()
    def get(self, request):
        context = {
            'form': self.form
        }
        return render(request, template_name=self.template, context=context)

    def post(self, request):
        form = UserCreationForm(request.POST)
        if form.is_valid:
            form.save()
            self.message = "User Successully Created"
        contest = {
            'form': form,
            'message': self.message
        }
        return render(request, template_name=self.template, context=contest)

#View
class demo(View):
    template = 'store/demo.html'
    name = None
    price = None
    def get(self,request):
        if User.is_superuser:
            self.name = Product.objects.values('name')
        else:
            self.price = Product.objects.values('price')
        context = {
            'names': self.name,
            'prices': self.price
        }
        return render(request, template_name=self.template, context=context)
