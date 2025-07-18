# Generated by Django 5.2.3 on 2025-06-30 04:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wellness', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='counsellingsession',
            name='reschedule_reason',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='counsellingsession',
            name='rescheduled_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='counsellingsession',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('scheduled', 'Scheduled'), ('completed', 'Completed'), ('cancelled', 'Cancelled'), ('rejected', 'Rejected'), ('rescheduled', 'Rescheduled')], default='pending', max_length=20),
        ),
    ]
