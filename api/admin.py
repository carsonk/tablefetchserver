from django.contrib import admin
from api.models import *

# Register your models here.

@admin.register(TableMap)
class TableMap(admin.ModelAdmin):
    pass

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    pass

@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    pass

@admin.register(PartyMember)
class PartyMemberAdmin(admin.ModelAdmin):
    pass

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    pass

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass

@admin.register(OrderMenuItem)
class OrderMenuItemAdmin(admin.ModelAdmin):
    pass


