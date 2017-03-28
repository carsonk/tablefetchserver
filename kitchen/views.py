from crispy_forms.helper import FormHelper
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from api.models import MenuItem, MenuCategory
from kitchen.forms.menu_item import MenuItemForm, MenuCategoryForm

def orders(request):
    context = {
        "side_active": "orders"
    }
    return render(request, "kitchen/orders.html", context)

def orders_create(request):
    context = {
        "side_active": "orders"
    }
    return render(request, "kitchen/orders_create.html", context)

def menu(request):
    menu_items = []

    menu_items = MenuCategory.objects.all()

    context = {
        "side_active": "menu",
        "menu_items": menu_items
    }
    return render(request, "kitchen/menu.html", context)

def menu_category_create(request):
    success = False
    form = MenuCategoryForm(request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            sucess = True
            form.save()
            form = MenuCategoryForm()

    context = {
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_category_create.html", context)

def menu_create(request):
    success = False
    form = MenuItemForm(request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            success = True
            form.save()
            form = MenuItemForm()

    context = {
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_create.html", context)

