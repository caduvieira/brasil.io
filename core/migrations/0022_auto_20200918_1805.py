# Generated by Django 3.1.1 on 2020-09-18 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0021_tablefile"),
    ]

    operations = [
        migrations.AddField(model_name="table", name="api_enabled", field=models.BooleanField(default=True),),
    ]
