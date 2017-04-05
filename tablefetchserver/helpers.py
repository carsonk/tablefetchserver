
from django.shortcuts import get_object_or_404

def construct_model_form(model_form_class, model_class, request, edit=None):
    success = False
    instance = None

    if edit is None:
        form = model_form_class(request.POST or None)
    else:
        instance = get_object_or_404(model_class, pk=edit)
        form = model_form_class(request.POST or None, instance=instance)

    if request.method == 'POST':
        if form.is_valid():
            success = True
            form.save()
            # Give back an empty form.
            form = model_form_class()

    return (success, instance, form)
