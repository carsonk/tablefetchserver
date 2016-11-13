from django.contrib.auth.models import User, Group
from api.models import *
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class TableMapSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TableMap
        fields = ('name')

class TableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Table
        fields = ('num_seats', 'x_coord', 'y_coord', 'width', 'height', 'color')

class PartySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Party
        fields = ('table', 'size', 'time_arrived', 'time_seated', 'time_paid')

class PartyMemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PartyMember
        fields = ('party')

class MenuCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ('parent', 'name', 'description')

class MenuItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MenuItem
        fields = ('category', 'name', 'description')

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ('party', 'party_member', 'menu_items')
