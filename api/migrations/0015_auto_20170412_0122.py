# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-04-12 01:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_ordermenuitem_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='time_finished',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='time_placed',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='time_updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
