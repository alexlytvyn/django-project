# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-09 08:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0003_student_student_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=256, verbose_name='\u041f\u0440\u0435\u0434\u043c\u0435\u0442')),
                ('examdate', models.DateTimeField(verbose_name='\u0414\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441 \u043f\u0440\u043e\u0432\u0435\u0434\u0435\u043d\u043d\u044f')),
                ('teacher', models.CharField(max_length=256, verbose_name='\u0412\u0438\u043a\u043b\u0430\u0434\u0430\u0447')),
                ('exam_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='students.Group', verbose_name='\u0413\u0440\u0443\u043f\u0430')),
            ],
            options={
                'verbose_name': '\u0406\u0441\u043f\u0438\u0442',
                'verbose_name_plural': '\u0406\u0441\u043f\u0438\u0442\u0438',
            },
        ),
    ]
