from django.contrib.auth.models import User, Group
from api.models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'url', 'name')

class TableMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableMap
        fields = ('id', 'name', 'width', 'height')

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'table_map', 'name', 'num_seats', 'x_coord', 'y_coord', 'width', 'height', 'color')

class PartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = ('id', 'table', 'size', 'time_arrived', 'time_seated', 'time_paid')

class PartyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyMember
        fields = ('id', 'party')

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ('id', 'parent', 'name', 'description')

class MenuIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuIngredient
        fields = ('id', 'name', 'description')

class MenuItemSerializer(serializers.ModelSerializer):
    possible_ingredients = MenuIngredientSerializer(many=True, read_only=True)
    default_ingredients = MenuIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ('id', 'category', 'name', 'description', 'price',
                'possible_ingredients', 'default_ingredients')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'party', 'party_member', 'menu_items', 'add_ingredients',
                'remove_ingredients')
