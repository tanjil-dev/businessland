# Generated by Django 3.1.2 on 2020-10-22 02:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0013_auto_20201020_2309'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='title',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='store.title'),
        ),
    ]
