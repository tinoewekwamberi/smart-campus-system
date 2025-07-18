# Generated by Django 5.2.3 on 2025-06-29 23:43

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='enrollment',
            name='grade_points',
        ),
        migrations.AddField(
            model_name='course',
            name='year',
            field=models.IntegerField(default=2024, help_text='Academic year'),
        ),
        migrations.AddField(
            model_name='enrollment',
            name='percentage_score',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Percentage score (0-100)', max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='course',
            name='semester',
            field=models.CharField(choices=[('first', 'First Semester'), ('second', 'Second Semester')], default='first', help_text='Semester offering', max_length=20),
        ),
        migrations.AlterField(
            model_name='enrollment',
            name='grade',
            field=models.CharField(blank=True, choices=[('A', 'A (80-100%)'), ('B', 'B (70-79%)'), ('C', 'C (60-69%)'), ('D', 'D (50-59%)'), ('F', 'F (0-49%)'), ('W', 'Withdrawn'), ('I', 'Incomplete')], max_length=2, null=True),
        ),
    ]
