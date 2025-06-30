from django.contrib import admin
from .models import Course, Enrollment, CourseSchedule, CourseMaterial


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'lecturer', 'level', 'course_type', 'credits', 'enrollment_count', 'is_active', 'semester', 'year']
    list_filter = ['level', 'course_type', 'is_active', 'semester', 'year', 'lecturer']
    search_fields = ['code', 'name', 'description']
    list_editable = ['is_active']
    readonly_fields = ['enrollment_count', 'is_full', 'available_spots', 'created_at', 'updated_at']
    filter_horizontal = ['prerequisites']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('code', 'name', 'description', 'credits', 'level', 'course_type')
        }),
        ('Course Details', {
            'fields': ('lecturer', 'max_students', 'prerequisites', 'syllabus', 'learning_outcomes')
        }),
        ('Status', {
            'fields': ('is_active', 'semester', 'year')
        }),
        ('Statistics', {
            'fields': ('enrollment_count', 'is_full', 'available_spots'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'enrolled_at', 'grade', 'percentage_score']
    list_filter = ['status', 'course', 'student', 'enrolled_at', 'grade']
    search_fields = ['student__username', 'student__first_name', 'student__last_name', 'course__code', 'course__name']
    readonly_fields = ['enrolled_at']
    
    fieldsets = (
        ('Enrollment Details', {
            'fields': ('student', 'course', 'status')
        }),
        ('Academic Information', {
            'fields': ('percentage_score', 'grade', 'notes')
        }),
        ('Timestamps', {
            'fields': ('enrolled_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(CourseSchedule)
class CourseScheduleAdmin(admin.ModelAdmin):
    list_display = ['course', 'day_of_week', 'start_time', 'end_time', 'room', 'building', 'is_lab']
    list_filter = ['day_of_week', 'is_lab', 'course', 'building']
    search_fields = ['course__code', 'course__name', 'room', 'building']
    
    fieldsets = (
        ('Schedule Information', {
            'fields': ('course', 'day_of_week', 'start_time', 'end_time')
        }),
        ('Location', {
            'fields': ('room', 'building', 'is_lab')
        }),
    )


@admin.register(CourseMaterial)
class CourseMaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'material_type', 'uploaded_by', 'uploaded_at', 'is_public']
    list_filter = ['material_type', 'is_public', 'uploaded_at', 'course']
    search_fields = ['title', 'description', 'course__code', 'course__name', 'uploaded_by__username']
    readonly_fields = ['uploaded_by', 'uploaded_at']
    
    fieldsets = (
        ('Material Information', {
            'fields': ('course', 'title', 'material_type', 'description')
        }),
        ('File Information', {
            'fields': ('file_url', 'file_name')
        }),
        ('Access Control', {
            'fields': ('is_public', 'uploaded_by')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not change:  # Only set uploaded_by on creation
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
