# Generated by Django 5.1.4 on 2024-12-30 10:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='file',
            old_name='filename',
            new_name='name',
        ),
    ]
