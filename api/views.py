from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions

from api.models import *
from api.serializers import *

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_Classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class TableMapViewSet(viewsets.ModelViewSet):
    queryset = TableMap.objects.all()
    serializer_class = TableMapSerializer
    permission_classes = [permissions.IsAuthenticated]

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.IsAuthenticated]

class PartyViewSet(viewsets.ModelViewSet):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = [permissions.IsAuthenticated]

class PartyMemberSet(viewsets.ModelViewSet):
    queryset = PartyMember.objects.all()
    serializer_class = PartyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

class MenuCategoryViewSet(viewsets.ModelViewSet):
    queryset = MenuCategory.objects.all()
    serializer_class = MenuCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = MenuCategory.objects.all()
        category_id = self.request.query_params.get('parent', None)
        if category_id is not None:
            queryset = queryset.filter(parent__id=category_id)
        return queryset

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = MenuItem.objects.all()
        category_id = self.request.query_params.get('category', None)
        if category_id is not None:
            queryset = queryset.filter(category__id=category_id)
        return queryset

class MenuIngredientViewSet(viewsets.ModelViewSet):
    queryset = MenuIngredient
    serializer_class = MenuIngredientSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


