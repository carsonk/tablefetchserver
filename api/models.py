from django.db import models

class TableMap(models.Model):
    """ A map to place tables on. """

    name = models.CharField(max_length=256)

class Table(models.Model):
    """ Representation of a table in the restaurant. """

    num_seats = models.PositiveSmallIntegerField()

    x_coord = models.IntegerField() # C-coord of corner on map.
    y_coord = models.IntegerField() # Y-coord of corner on map.
    width = models.IntegerField() # Width in pixels on map.
    height = models.IntegerField() # Height in pixels on map.
    color = models.IntegerField() # 32-bit RGB hexcolor.

class Party(models.Model):
    """ A party of people sitting at a specified table. """

    table = models.OneToOneField(Table, on_delete=models.CASCADE)

    size = models.PositiveSmallIntegerField()
    time_arrived = models.DateTimeField()
    time_seated = models.DateTimeField()
    time_paid = models.DateTimeField()

class PartyMember(models.Model):
    """ An individual member of a party. """

    party = models.ForeignKey(Party, on_delete=models.CASCADE)

class MenuCategory(models.Model):
    """ A category for menu items. """

    parent = models.ForeignKey("self", on_delete=models.CASCADE, default=None, null=True, blank=True)
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    """ A choosable menu item. """

    category = models.ManyToManyField(MenuCategory, default=None, blank=True)

    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    """ Representation of an order.
    Should be attached to party or party_member. Interface provides
    flexibility to choose to attach order to a single person, or to a
    party as a whole.
    """

    party = models.ForeignKey(Party, on_delete=models.CASCADE)
    party_member = models.OneToOneField(PartyMember, on_delete=models.CASCADE)

    menu_items = models.ManyToManyField(MenuItem, through='OrderMenuItem')

class OrderMenuItem(models.Model):
    """ Through model combining order and menu item. """

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem)

    comments = models.TextField()
 
