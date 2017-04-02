from crispy_forms.helper import FormHelper
from django.shortcuts import get_object_or_404, render
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

def menu(request, category_id=None):
    breadcrumbs = []

    if category_id is None:
        category = None
    else:
        category = MenuCategory.objects.get(pk=category_id)
        breadcrumbs.append(category)

        parent = category.parent
        while parent is not None:
            breadcrumbs.append(parent)
            parent = parent.parent

    category_items = MenuCategory.objects.filter(parent=category)
    menu_items = MenuItem.objects.filter(category=category)

    items = []
    for item in category_items:
        items.append({ "type": "category", "obj": item })
    for item in menu_items:
        items.append({ "type": "item", "obj": item })

    context = {
        "side_active": "menu",
        "items": items,
        "category": category,
        "breadcrumbs": breadcrumbs
    }
    return render(request, "kitchen/menu.html", context)

def menu_category_create(request, edit=None):
    success = False
    category = None

    if edit is None:
        form = MenuCategoryForm(request.POST or None)
    else:
        category = get_object_or_404(MenuCategory, pk=edit)

        if request.POST:
            form = MenuCategoryForm(request.POST)
        else:
            form = MenuCategoryForm(instance=category)

    if request.method == 'POST':
        if form.is_valid():
            sucess = True
            form.save()
            form = MenuCategoryForm()

    context = {
        "category": category,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_category_create.html", context)

def menu_create(request, edit=None):
    success = False
    item = None

    if edit is None:
        form = MenuItemForm(request.POST or None)
    else:
        item = get_object_or_404(MenuItem, pk=edit)

        if request.POST:
            form = MenuItemForm(request.POST)
        else:
            form = MenuItemForm(instance=item)

    if request.method == 'POST':
        if form.is_valid():
            success = True
            form.save()
            form = MenuItemForm()

    context = {
        "item": item,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_create.html", context)

