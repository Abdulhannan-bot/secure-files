# Generated by Django 5.1.4 on 2024-12-30 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_alter_file_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.TextField(),
        ),
    ]