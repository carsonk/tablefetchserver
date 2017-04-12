from crispy_forms.helper import FormHelper
import datetime
from django.shortcuts import get_object_or_404, render
from django.http import Http404, JsonResponse
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

from api.models import MenuItem, MenuIngredient, Order, OrderMenuItem, Party, PartyMember

def get_json_404(message):
    return JsonResponse({'message': message, 'success': False}, status=404)

def submit_order(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Must use POST request.'})

    success = False
    data = json.loads(request.body.decode("utf-8"))

    is_new_party = False
    if data["party"] == 0:
        party = Party()
        party.time_arrived = datetime.datetime.now()
        party.time_seated = datetime.datetime.now()
        party.size = 1 # TODO: Allow user to select size.
        party.save()
        is_new_party = True
    else:
        try:
            party = Party.objects.get(pk=int(data["party"]))
        except Party.DoesNotExist:
            return get_json_404("That party does not exist.")

    is_new_member = False
    if data["member"] == 0 or data["party"] == 0:
        member = PartyMember.objects.create(party=party)
        is_new_member = True
    else:
        try:
            member = PartyMember.objects.get(pk=int(data["member"]))
        except PartyMember.DoesNotExist:
            if is_new_party:
                party.delete()
            return get_json_404("That party member did not exist.")

    order = Order.objects.create(party=party, party_member=member)

    for request_item in data["items"]:
        try:
            item = MenuItem.objects.get(pk=request_item["id"])
        except MenuItem.DoesNotExist:
            if is_new_party:
                party.delete()
            if is_new_member:
                member.delete()
            return get_json_404("A given menu item does not exist.")

        add_ingredients = MenuIngredient.objects.filter(
            id__in=request_item["add_ingredients"])
        remove_ingredients = MenuIngredient.objects.filter(
            id__in=request_item["remove_ingredients"])

        # TODO: Check that all ingredients were found.
        # TODO: Or, just directly use IDs to add ingredients. Check the exception.

        relationship = OrderMenuItem.objects.create(order=order, menu_item=item,
            quantity=request_item["quantity"])
        relationship.add_ingredients.add(*list(add_ingredients))
        relationship.remove_ingredients.add(*list(remove_ingredients))

    return JsonResponse({'success': True})
