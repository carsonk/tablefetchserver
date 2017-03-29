from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'table/map', views.TableMapViewSet)
router.register(r'tables', views.TableViewSet)
router.register(r'parties', views.PartyViewSet)
router.register(r'menu/categories', views.MenuCategoryViewSet)
router.register(r'menu/items', views.MenuItemViewSet)
router.register(r'orders', views.OrderViewSet)

