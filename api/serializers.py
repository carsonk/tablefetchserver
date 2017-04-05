from django.contrib.auth.models import User, Group
from api.models import *
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'url', 'name')

class TableMapSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TableMap
        fields = ('id', 'name')

class TableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'num_seats', 'x_coord', 'y_coord', 'width', 'height', 'color')

class PartySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Party
        fields = ('id', 'table', 'size', 'time_arrived', 'time_seated', 'time_paid')

class PartyMemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PartyMember
        fields = ('id', 'party')

class MenuCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ('id', 'parent', 'name', 'description')

class MenuItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MenuItem
        fields = ('id', 'category', 'name', 'description', 'price', 'default_ingredients', 'possible_ingredients')

class MenuIngredientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MenuIngredient
        fields = ('name', 'description')

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'party', 'party_member', 'menu_items', 'add_ingredients', 'remove_ingredients')

