from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Course(models.Model):
    COURSE_LEVELS = [
        ('100', '100 Level'),
        ('200', '200 Level'),
        ('300', '300 Level'),
        ('400', '400 Level'),
        ('500', '500 Level'),
        ('600', '600 Level'),
    ]
    
    COURSE_TYPES = [
        ('core', 'Core Course'),
        ('elective', 'Elective Course'),
        ('lab', 'Laboratory Course'),
        ('project', 'Project Course'),
        ('seminar', 'Seminar Course'),
    ]

    SEMESTER_CHOICES = [
        ('first', 'First Semester'),
        ('second', 'Second Semester'),
    ]
    
    code = models.CharField(max_length=10, unique=True, help_text="Course code (e.g., IT101)")
    name = models.CharField(max_length=200, help_text="Course name")
    description = models.TextField(help_text="Course description")
    credits = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)],
        help_text="Number of credit hours (1-6)"
    )
    level = models.CharField(max_length=3, choices=COURSE_LEVELS, default='100')
    course_type = models.CharField(max_length=20, choices=COURSE_TYPES, default='core')
    lecturer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='teaching_courses',
        limit_choices_to={'role': 'lecturer'}
    )
    students = models.ManyToManyField(
        User, 
        related_name='enrolled_courses',
        through='Enrollment',
        blank=True
    )
    max_students = models.IntegerField(
        default=50,
        validators=[MinValueValidator(1), MaxValueValidator(200)],
        help_text="Maximum number of students allowed"
    )
    prerequisites = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        help_text="Prerequisite courses"
    )
    syllabus = models.TextField(blank=True, help_text="Course syllabus")
    learning_outcomes = models.TextField(blank=True, help_text="Learning outcomes")
    is_active = models.BooleanField(default=True, help_text="Course is active and available for enrollment")
    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES, default='first', help_text="Semester offering")
    year = models.IntegerField(default=2024, help_text="Academic year")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['level', 'code']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def enrollment_count(self):
        return self.students.count()

    @property
    def is_full(self):
        return self.enrollment_count >= self.max_students

    @property
    def available_spots(self):
        return max(0, self.max_students - self.enrollment_count)


class Enrollment(models.Model):
    ENROLLMENT_STATUS = [
        ('enrolled', 'Enrolled'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
        ('pending', 'Pending Approval'),
    ]

    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='course_enrollments',
        limit_choices_to={'role': 'student'}
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=ENROLLMENT_STATUS, 
        default='enrolled'
    )
    percentage_score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage score (0-100)"
    )
    grade = models.CharField(
        max_length=2, 
        blank=True, 
        null=True,
        choices=[
            ('A', 'A (80-100%)'), ('B', 'B (70-79%)'), ('C', 'C (60-69%)'),
            ('D', 'D (50-59%)'), ('F', 'F (0-49%)'),
            ('W', 'Withdrawn'), ('I', 'Incomplete'),
        ]
    )
    notes = models.TextField(blank=True, help_text="Additional notes")

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-enrolled_at']
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'

    def __str__(self):
        return f"{self.student.username} - {self.course.code}"

    def save(self, *args, **kwargs):
        # Auto-calculate grade based on percentage score
        if self.percentage_score is not None and not self.grade:
            if self.percentage_score >= 80:
                self.grade = 'A'
            elif self.percentage_score >= 70:
                self.grade = 'B'
            elif self.percentage_score >= 60:
                self.grade = 'C'
            elif self.percentage_score >= 50:
                self.grade = 'D'
            else:
                self.grade = 'F'
        super().save(*args, **kwargs)


class CourseSchedule(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True)
    building = models.CharField(max_length=50, blank=True)
    is_lab = models.BooleanField(default=False, help_text="Is this a laboratory session?")

    class Meta:
        unique_together = ['course', 'day_of_week', 'start_time']
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.course.code} - {self.day_of_week} {self.start_time}"


class CourseMaterial(models.Model):
    MATERIAL_TYPES = [
        ('syllabus', 'Syllabus'),
        ('lecture_notes', 'Lecture Notes'),
        ('assignment', 'Assignment'),
        ('reading', 'Reading Material'),
        ('video', 'Video'),
        ('other', 'Other'),
    ]

    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='materials'
    )
    title = models.CharField(max_length=200)
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPES)
    description = models.TextField(blank=True)
    file_url = models.URLField(blank=True, help_text="URL to the material file")
    file_name = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='uploaded_materials'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True, help_text="Visible to all enrolled students")

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.course.code} - {self.title}"
