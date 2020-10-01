import json
import datetime

from django.views import View
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


from store.models import *
from store.form.core_form import *
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

class ProductView(View):
    template = 'store/product_page.html'
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
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('store')
        else:
            messages.info(request, 'Username or password is incorrect')
            return render(request, template_name=self.template)
        context = {}
        return render(request, template_name=self.template, context=context)

class logOut(View):
    def get(self, request):
        logout(request)
        return redirect('login')

class registerPage(View):
    template = 'store/register.html'
    form = CreateUserForm()
    message = None
    error = None
    def get(self, request):
        context = {
            'form': self.form
        }
        return render(request, template_name=self.template, context=context)

    def post(self, request):
        self.form = CreateUserForm(request.POST)
        if self.form.is_valid():
            self.form.save()
            user = self.form.cleaned_data.get('username')
            messages.success(request, 'Account was created for ' + user)
            return redirect('login')

        context = {
            'form': self.form
        }
        return render(request, template_name=self.template, context=context)

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