from django.conf.urls import url
from . import views

urlpatterns = [
     url('^$', views.orders, name='orders'),
     url(r'^menu/(?P<category_id>\d+)?$', views.menu, name='menu'),
     url('^menu/create/$', views.menu_create, name='menu_create'),
     url('^menu/category/create/$', views.menu_category_create, name='menu_category_create'),
     url('^orders/create/$', views.orders_create, name='orders_create'),
]
