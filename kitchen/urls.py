from django.conf.urls import url
from . import views

urlpatterns = [
     url('^$', views.orders),
     url('^map$', views.map, name='map'),
     url('^orders$', views.orders, name='orders'),
     url('^orders/create$', views.orders_create, name='orders_create'),
     url(r'^menu/(?P<category_id>\d+)?$', views.menu, name='menu'),
     url(r'^menu/ingredients$', views.menu_ingredients, name='menu_ingredients'),
     url('^menu/create$', views.menu_create, name='menu_create'),
     url('^menu/edit/(?P<edit>\d+)?$', views.menu_create, name='menu_edit'),
     url('^menu/category/create$', views.menu_category_create, name='menu_category_create'),
     url('^menu/category/edit/(?P<edit>\d+)?$', views.menu_category_create,
         name='menu_category_edit'),
     url('^menu/ingredient/create$', views.menu_ingredient_create, name='menu_ingredient_create'),
     url('menu/ingredient/edit/(?P<edit>\d+)?$', views.menu_ingredient_create,
         name='menu_ingredient_edit'),
]
