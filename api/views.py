from crispy_forms.helper import FormHelper
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def submit_order(request):
    return JsonResponse({'success': True})
