# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-04-16 05:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20170415_0536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='party',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Party'),
        ),
        migrations.AlterField(
            model_name='order',
            name='party_member',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.PartyMember'),
        ),
        migrations.AlterField(
            model_name='party',
            name='size',
            field=models.PositiveSmallIntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='party',
            name='time_arrived',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='table',
            name='name',
            field=models.SlugField(),
        ),
    ]
