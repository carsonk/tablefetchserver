from crispy_forms.helper import FormHelper
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from api.models import MenuItem, MenuIngredient, MenuCategory, Order, Table, TableMap, Party, PartyMember
from kitchen.forms.menu_item import MenuItemForm, MenuIngredientForm, MenuCategoryForm
from kitchen.forms.party import PartyForm, PartyMemberForm
from tablefetchserver import helpers

def login(request):
    if request.user.is_authenticated:
        return redirect("map")

    context = {"error": None, "username": ""}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)

        if user is not None and user.is_active:
            auth_login(request, user)
            return redirect(request.GET.get("next") or "map")
        else:
            context = {
                "error": "Could not validate those credentials!",
                "username": username
            }

    return render(request, "kitchen/login.html", context)

def logout(request):
    auth_logout(request)
    return redirect("login")

@login_required()
def map(request, edit=False):
    tables = Table.objects.all()

    context = {
        "edit": edit,
        "tables": tables,
        "side_active": "map"
    }
    return render(request, "kitchen/map.html", context)

@login_required()
def orders(request):
    orders = Order.objects.filter(time_finished=None)

    context = {
        "orders": orders,
        "side_active": "orders"
    }
    return render(request, "kitchen/orders.html", context)

@login_required()
def orders_create(request):
    parties = Party.objects.filter(time_paid=None)

    context = {
        "parties": parties,
        "side_active": "orders"
    }
    return render(request, "kitchen/orders_create.html", context)

@login_required()
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

@login_required()
def menu_ingredients(request):
    ingredients = MenuIngredient.objects.all()
    context = {
        "ingredients": ingredients,
        "side_active": "menu"
    }
    return render(request, "kitchen/menu_ingredients.html", context)

@login_required()
def menu_category_create(request, edit=None):
    (success, category, form) = helpers.construct_model_form(MenuCategoryForm, MenuCategory, request, edit)

    context = {
        "category": category,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_category_create.html", context)

@login_required()
def menu_ingredient_create(request, edit=None):
    (success, ingredient, form) = helpers.construct_model_form(MenuIngredientForm, MenuIngredient, request, edit)

    context = {
        "ingredient": ingredient,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_ingredient_create.html", context)

@login_required()
def menu_create(request, edit=None):
    (success, item, form) = helpers.construct_model_form(MenuItemForm, MenuItem, request, edit)

    context = {
        "item": item,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_create.html", context)

@login_required()
def party_create(request, edit=None):
    (success, party, form) = helpers.construct_model_form(PartyForm, Party, request, edit)

    context = {
        "party": party,
        "side_active": "parties",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/party_create.html", context)
