from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'table/map', views.TableMapViewSet, base_name='tablemap')
router.register(r'tables', views.TableViewSet, base_name='table')
router.register(r'parties', views.PartyViewSet, base_name='party')
router.register(r'menu/categories', views.MenuCategoryViewSet, base_name='menucategory')
router.register(r'menu/items', views.MenuItemViewSet, base_name='menuitem')
router.register(r'menu/ingredients', views.MenuIngredientViewSet, base_name='menuingredient')
router.register(r'orders', views.OrderViewSet, base_name='order')

