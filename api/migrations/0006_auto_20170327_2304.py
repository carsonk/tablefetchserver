# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-03-27 23:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20170327_2300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menucategory',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='menuitem',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
