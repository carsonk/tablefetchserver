from django.conf.urls import url
from . import views

urlpatterns = [
     url(r'^$', views.orders),
     url(r'^map$', views.map, name='map'),
     url(r'^map/edit$', views.map, {'edit': True}, name='map_edit'),
     url(r'^orders$', views.orders, name='orders'),
     url(r'^orders/create$', views.orders_create, name='orders_create'),
     url(r'^menu/(?P<category_id>\d+)?$', views.menu, name='menu'),
     url(r'^menu/ingredients$', views.menu_ingredients, name='menu_ingredients'),
     url(r'^menu/create$', views.menu_create, name='menu_create'),
     url(r'^menu/edit/(?P<edit>\d+)?$', views.menu_create, name='menu_edit'),
     url(r'^menu/category/create$', views.menu_category_create, name='menu_category_create'),
     url(r'^menu/category/edit/(?P<edit>\d+)?$', views.menu_category_create,
         name='menu_category_edit'),
     url(r'^menu/ingredient/create$', views.menu_ingredient_create, name='menu_ingredient_create'),
     url(r'^menu/ingredient/edit/(?P<edit>\d+)?$', views.menu_ingredient_create,
         name='menu_ingredient_edit'),
     url(r'^party/create$', views.party_create, name='party_create'),
     url(r'^party/edit/(?P<edit>\d+)?$', views.party_create, name='party_edit')
]
