# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-03-27 23:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20170327_2259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menuitem',
            name='category',
            field=models.ManyToManyField(blank=True, default=None, to='api.MenuCategory'),
        ),
    ]
