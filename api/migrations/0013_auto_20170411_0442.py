# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-04-11 04:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20170411_0435'),
    ]

    operations = [
        migrations.AlterField(
            model_name='party',
            name='time_paid',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='party',
            name='time_seated',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
