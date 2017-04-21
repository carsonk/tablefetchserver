from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.forms import ModelForm

from api.models import Party, PartyMember

class PartyForm(ModelForm):
    class Meta:
        model = Party
        fields = ['table', 'name', 'size', 'time_seated', 'time_paid']

    def __init__(self, *args, **kwargs):
        super(PartyForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        
        self.helper.add_input(Submit('submit', 'Submit'))

class PartyMemberForm(ModelForm):
    class Meta:
        model = PartyMember
        fields = ['party']

    def __init__(self, *args, **kwargs):
        super(PartyMemberForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        
        self.helper.add_input(Submit('submit', 'Submit'))

