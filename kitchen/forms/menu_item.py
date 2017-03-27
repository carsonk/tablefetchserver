from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.forms import ModelForm

from api.models import MenuItem, MenuCategory

class MenuItemForm(ModelForm):
    class Meta:
        model = MenuItem
        fields = ['category', 'name', 'description']

    def __init__(self, *args, **kwargs):
        super(MenuItemForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        
        self.helper.add_input(Submit('submit', 'Submit'))

class MenuCategoryForm(ModelForm):
    class Meta:
        model = MenuCategory
        fields = ['parent', 'name', 'description']

    def __init__(self, *args, **kwargs):
        super(MenuCategoryForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        
        self.helper.add_input(Submit('submit', 'Submit'))

