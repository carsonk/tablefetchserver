from crispy_forms.helper import FormHelper
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from api.models import MenuItem, MenuIngredient, MenuCategory, Table, TableMap
from kitchen.forms.menu_item import MenuItemForm, MenuIngredientForm, MenuCategoryForm
from tablefetchserver import helpers

def map(request):
    context = {
        "side_active": "map"
    }
    return render(request, "kitchen/map.html", context)

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

def menu_ingredients(request):
    ingredients = MenuIngredient.objects.all()
    context = {
        "ingredients": ingredients,
        "side_active": "menu"
    }
    return render(request, "kitchen/menu_ingredients.html", context)

def menu_category_create(request, edit=None):
    (success, category, form) = helpers.construct_model_form(MenuCategoryForm, MenuCategory, request, edit)

    context = {
        "category": category,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_category_create.html", context)

def menu_ingredient_create(request, edit=None):
    (success, ingredient, form) = helpers.construct_model_form(MenuIngredientForm, MenuIngredient, request, edit)

    context = {
        "ingredient": ingredient,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_ingredient_create.html", context)

def menu_create(request, edit=None):
    (success, item, form) = helpers.construct_model_form(MenuItemForm, MenuItem, request, edit)

    context = {
        "item": item,
        "side_active": "menu",
        "success": success,
        "form": form
    }
    return render(request, "kitchen/menu_create.html", context)
