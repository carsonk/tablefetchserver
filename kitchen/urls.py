from django.conf.urls import url
from . import views

urlpatterns = [
     url('^$', views.orders),
     url('^orders$', views.orders, name='orders'),
     url('^orders/create$', views.orders_create, name='orders_create'),
     url(r'^menu/(?P<category_id>\d+)?$', views.menu, name='menu'),
     url('^menu/create$', views.menu_create, name='menu_create'),
     url('^menu/edit/(?P<edit>\d+)?$', views.menu_create, name='menu_edit'),
     url('^menu/category/create$', views.menu_category_create, name='menu_category_create'),
     url('^menu/category/edit/(?P<edit>\d+)?$', views.menu_category_create, name='menu_category_edit'),
]

