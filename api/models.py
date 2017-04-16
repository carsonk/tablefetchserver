from django.db import models

class TableMap(models.Model):
    """ A map to place tables on. """

    name = models.CharField(max_length=256)

    # Width and height give proportions for map image.
    # Will be scaled proportional to browser width.
    width = models.PositiveSmallIntegerField(default=1000)
    height = models.PositiveSmallIntegerField(default=600)

class Table(models.Model):
    """ Representation of a table in the restaurant. """

    table_map = models.ForeignKey(TableMap, on_delete=models.CASCADE, null=True, blank=True)
    num_seats = models.PositiveSmallIntegerField()

    name = models.SlugField(max_length=50)

    x_coord = models.IntegerField(default=50) # C-coord of corner on map.
    y_coord = models.IntegerField(default=50) # Y-coord of corner on map.
    width = models.IntegerField(default=100) # Width in pixels on map.
    height = models.IntegerField(default=100) # Height in pixels on map.
    color = models.IntegerField(default=0xFFFFFF) # 32-bit RGB hexcolor.

class Party(models.Model):
    """ A party of people sitting at a specified table. """

    table = models.ForeignKey(Table, on_delete=models.CASCADE, null=True, blank=True)

    size = models.PositiveSmallIntegerField(null=True, blank=True, default=None)
    time_arrived = models.DateTimeField(auto_now_add=True)
    time_seated = models.DateTimeField(null=True, blank=True, default=None)
    time_paid = models.DateTimeField(null=True, blank=True, default=None)

class PartyMember(models.Model):
    """ An individual member of a party. """

    party = models.ForeignKey(Party, on_delete=models.CASCADE)

class MenuCategory(models.Model):
    """ A category for menu items. """

    parent = models.ForeignKey("self", on_delete=models.CASCADE, default=None, null=True,
        blank=True)
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class MenuIngredient(models.Model):
    """ An ingredient on a menu item. (e.g. bread on a sandwhich) """

    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    """ A choosable menu item. """

    category = models.ManyToManyField(MenuCategory, default=None, blank=True)
    default_ingredients = models.ManyToManyField(MenuIngredient,
        related_name='default_on', blank=True)
    possible_ingredients = models.ManyToManyField(MenuIngredient,
        related_name='possible_on', blank=True)

    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class Order(models.Model):
    """ Representation of an order.
    Should be attached to party or party_member. Interface provides
    flexibility to choose to attach order to a single person, or to a
    party as a whole.
    """

    party = models.ForeignKey(Party, on_delete=models.CASCADE, null=True)
    party_member = models.ForeignKey(PartyMember, on_delete=models.CASCADE, null=True)

    time_placed = models.DateTimeField(auto_now_add=True)
    time_updated = models.DateTimeField(auto_now=True)
    time_finished = models.DateTimeField(default=None, blank=True, null=True)

    menu_items = models.ManyToManyField(MenuItem, through='OrderMenuItem')

class OrderMenuItem(models.Model):
    """ Through model combining order and menu item. """

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem)
    quantity = models.PositiveSmallIntegerField(default=1)

    add_ingredients = models.ManyToManyField(MenuIngredient,
            related_name='added_to', default=None, blank=True)
    remove_ingredients = models.ManyToManyField(MenuIngredient,
            related_name='removed_from', default=None, blank=True)

    comments = models.TextField()
