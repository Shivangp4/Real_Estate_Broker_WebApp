# Generated by Django 5.0.2 on 2024-03-14 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_remove_userprofile_portfolio_userprofile_portfolio'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='image',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
