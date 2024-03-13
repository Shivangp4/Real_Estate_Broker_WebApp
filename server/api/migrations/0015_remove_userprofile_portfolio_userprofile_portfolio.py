# Generated by Django 5.0.2 on 2024-03-13 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_rename_watch_list_userprofile_watchlist'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='portfolio',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='portfolio',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
