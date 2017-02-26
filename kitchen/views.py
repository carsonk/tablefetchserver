from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def orders(request):
    template = loader.get_template("kitchen/orders.html")
    context = {}
    return HttpResponse(template.render(context, request)) 

