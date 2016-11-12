# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-12 21:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MenuCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.MenuCategory')),
            ],
        ),
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('category', models.ManyToManyField(to='api.MenuCategory')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='OrderMenuItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comments', models.TextField()),
                ('menu_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.MenuItem')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Order')),
            ],
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size', models.PositiveSmallIntegerField()),
                ('time_arrived', models.DateTimeField()),
                ('time_seated', models.DateTimeField()),
                ('time_paid', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='PartyMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('party', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Party')),
            ],
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_seats', models.PositiveSmallIntegerField()),
                ('x_coord', models.IntegerField()),
                ('y_coord', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('color', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='TableMap',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
            ],
        ),
        migrations.AddField(
            model_name='party',
            name='table',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.Table'),
        ),
        migrations.AddField(
            model_name='order',
            name='menu_items',
            field=models.ManyToManyField(through='api.OrderMenuItem', to='api.MenuItem'),
        ),
        migrations.AddField(
            model_name='order',
            name='party',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Party'),
        ),
        migrations.AddField(
            model_name='order',
            name='party_member',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.PartyMember'),
        ),
    ]
