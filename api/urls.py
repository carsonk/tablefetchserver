from django.conf.urls import url
from rest_framework import routers
from api import views, viewsets

router = routers.DefaultRouter()
router.register(r'users', viewsets.UserViewSet)
router.register(r'groups', viewsets.GroupViewSet)
router.register(r'table/map', viewsets.TableMapViewSet, base_name='tablemap')
router.register(r'tables', viewsets.TableViewSet, base_name='table')
router.register(r'parties', viewsets.PartyViewSet, base_name='party')
router.register(r'menu/categories', viewsets.MenuCategoryViewSet, base_name='menucategory')
router.register(r'menu/items', viewsets.MenuItemViewSet, base_name='menuitem')
router.register(r'menu/ingredients', viewsets.MenuIngredientViewSet, base_name='menuingredient')
router.register(r'orders', viewsets.OrderViewSet, base_name='order')

urlpatterns = router.urls
urlpatterns += [
    url(r'^orders/submit$', views.submit_order, name='api-submitorder'),
]
