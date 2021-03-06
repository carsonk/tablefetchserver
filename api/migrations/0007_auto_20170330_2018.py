# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-03-30 20:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20170327_2304'),
    ]

    operations = [
        migrations.CreateModel(
            name='MenuIngredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='menuitem',
            name='default_ingredients',
            field=models.ManyToManyField(blank=True, related_name='default_on', to='api.MenuIngredient'),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='possible_ingredients',
            field=models.ManyToManyField(blank=True, related_name='possible_on', to='api.MenuIngredient'),
        ),
        migrations.AddField(
            model_name='ordermenuitem',
            name='add_ingredients',
            field=models.ManyToManyField(blank=True, default=None, related_name='added_to', to='api.MenuIngredient'),
        ),
        migrations.AddField(
            model_name='ordermenuitem',
            name='remove_ingredient',
            field=models.ManyToManyField(blank=True, default=None, related_name='removed_from', to='api.MenuIngredient'),
        ),
    ]
