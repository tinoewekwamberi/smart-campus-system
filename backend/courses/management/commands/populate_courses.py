from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, CourseSchedule, CourseMaterial
from datetime import time

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with sample Richfield-inspired IT courses'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample courses...')
        
        # Get or create a lecturer
        lecturer, created = User.objects.get_or_create(
            username='lecturer1',
            defaults={
                'email': 'lecturer1@richfield.ac.za',
                'first_name': 'Dr. Thabo',
                'last_name': 'Mokoena',
                'role': 'lecturer',
                'is_staff': True
            }
        )
        if created:
            lecturer.set_password('password123')
            lecturer.save()
            self.stdout.write(f'Created lecturer: {lecturer.username}')
        
        # Sample courses data
        courses_data = [
            {
                'code': 'IT101',
                'name': 'Introduction to Information Technology',
                'description': 'Fundamental concepts of IT including hardware, software, networks, and basic programming principles.',
                'credits': 3,
                'level': '100',
                'course_type': 'core',
                'max_students': 60,
                'syllabus': 'Week 1: Introduction to IT\nWeek 2: Computer Hardware\nWeek 3: Software Systems\nWeek 4: Networks and Internet\nWeek 5: Basic Programming\nWeek 6: Database Fundamentals\nWeek 7: Web Technologies\nWeek 8: IT Ethics and Security\nWeek 9: Cloud Computing\nWeek 10: Emerging Technologies\nWeek 11: Project Work\nWeek 12: Final Assessment',
                'learning_outcomes': '1. Understand fundamental IT concepts\n2. Identify hardware and software components\n3. Explain network principles\n4. Write basic programs\n5. Understand database concepts\n6. Apply IT ethics and security principles',
                'semester': 'first',
                'year': 2024,
                'schedules': [
                    {'day_of_week': 'monday', 'start_time': '09:00', 'end_time': '10:30', 'room': '101', 'building': 'IT Building'},
                    {'day_of_week': 'wednesday', 'start_time': '14:00', 'end_time': '15:30', 'room': 'Lab 1', 'building': 'IT Building', 'is_lab': True},
                ],
                'materials': [
                    {'title': 'Course Syllabus', 'material_type': 'syllabus', 'description': 'Complete course syllabus and schedule'},
                    {'title': 'IT Fundamentals Textbook', 'material_type': 'reading', 'description': 'Required textbook for the course'},
                    {'title': 'Lab Manual', 'material_type': 'reading', 'description': 'Laboratory exercises and instructions'},
                ]
            },
            {
                'code': 'IT201',
                'name': 'AWS Cloud Computing Fundamentals',
                'description': 'Introduction to Amazon Web Services cloud computing platform, including EC2, S3, and basic cloud architecture.',
                'credits': 4,
                'level': '200',
                'course_type': 'core',
                'max_students': 45,
                'syllabus': 'Week 1: Cloud Computing Basics\nWeek 2: AWS Global Infrastructure\nWeek 3: EC2 Instances\nWeek 4: S3 Storage\nWeek 5: VPC and Networking\nWeek 6: Security and IAM\nWeek 7: Database Services\nWeek 8: Load Balancing\nWeek 9: Auto Scaling\nWeek 10: Monitoring and Logging\nWeek 11: Cost Optimization\nWeek 12: Final Project',
                'learning_outcomes': '1. Understand cloud computing principles\n2. Deploy and manage EC2 instances\n3. Configure S3 storage solutions\n4. Set up VPC and networking\n5. Implement security best practices\n6. Design scalable cloud architectures',
                'semester': 'first',
                'year': 2024,
                'schedules': [
                    {'day_of_week': 'tuesday', 'start_time': '10:00', 'end_time': '11:30', 'room': '201', 'building': 'IT Building'},
                    {'day_of_week': 'thursday', 'start_time': '13:00', 'end_time': '15:00', 'room': 'Cloud Lab', 'building': 'IT Building', 'is_lab': True},
                ],
                'materials': [
                    {'title': 'AWS Cloud Practitioner Guide', 'material_type': 'reading', 'description': 'AWS official study guide'},
                    {'title': 'Cloud Architecture Patterns', 'material_type': 'reading', 'description': 'Best practices for cloud design'},
                    {'title': 'AWS Lab Exercises', 'material_type': 'assignment', 'description': 'Hands-on AWS exercises'},
                ]
            },
            {
                'code': 'IT301',
                'name': 'CISCO Network Administration',
                'description': 'Comprehensive network administration using CISCO equipment, including routing, switching, and network security.',
                'credits': 4,
                'level': '300',
                'course_type': 'core',
                'max_students': 40,
                'syllabus': 'Week 1: Network Fundamentals\nWeek 2: CISCO IOS Basics\nWeek 3: Routing Protocols\nWeek 4: Switching Concepts\nWeek 5: VLAN Configuration\nWeek 6: Network Security\nWeek 7: WAN Technologies\nWeek 8: Network Troubleshooting\nWeek 9: Network Design\nWeek 10: Advanced Routing\nWeek 11: Network Automation\nWeek 12: CCNA Preparation',
                'learning_outcomes': '1. Configure CISCO routers and switches\n2. Implement routing protocols\n3. Set up VLANs and trunking\n4. Configure network security\n5. Troubleshoot network issues\n6. Design enterprise networks',
                'semester': 'second',
                'year': 2024,
                'schedules': [
                    {'day_of_week': 'monday', 'start_time': '14:00', 'end_time': '15:30', 'room': '301', 'building': 'IT Building'},
                    {'day_of_week': 'friday', 'start_time': '09:00', 'end_time': '12:00', 'room': 'Network Lab', 'building': 'IT Building', 'is_lab': True},
                ],
                'materials': [
                    {'title': 'CISCO CCNA Study Guide', 'material_type': 'reading', 'description': 'Official CCNA preparation material'},
                    {'title': 'Network Configuration Examples', 'material_type': 'reading', 'description': 'Real-world network configurations'},
                    {'title': 'CISCO Lab Manual', 'material_type': 'assignment', 'description': 'Hands-on CISCO lab exercises'},
                ]
            },
            {
                'code': 'IT401',
                'name': 'IBM Data Analytics and Business Intelligence',
                'description': 'Advanced data analytics using IBM tools, including data mining, predictive analytics, and business intelligence solutions.',
                'credits': 4,
                'level': '400',
                'course_type': 'core',
                'max_students': 35,
                'syllabus': 'Week 1: Data Analytics Fundamentals\nWeek 2: IBM SPSS Statistics\nWeek 3: Data Mining Techniques\nWeek 4: Predictive Analytics\nWeek 5: Business Intelligence Tools\nWeek 6: Data Visualization\nWeek 7: Machine Learning Basics\nWeek 8: Statistical Analysis\nWeek 9: Big Data Processing\nWeek 10: Data Governance\nWeek 11: Analytics Project\nWeek 12: Final Presentation',
                'learning_outcomes': '1. Use IBM analytics tools\n2. Apply data mining techniques\n3. Build predictive models\n4. Create data visualizations\n5. Implement BI solutions\n6. Understand data governance',
                'semester': 'second',
                'year': 2024,
                'schedules': [
                    {'day_of_week': 'wednesday', 'start_time': '10:00', 'end_time': '11:30', 'room': '401', 'building': 'IT Building'},
                    {'day_of_week': 'friday', 'start_time': '14:00', 'end_time': '17:00', 'room': 'Analytics Lab', 'building': 'IT Building', 'is_lab': True},
                ],
                'materials': [
                    {'title': 'IBM Data Science Handbook', 'material_type': 'reading', 'description': 'Comprehensive guide to IBM analytics'},
                    {'title': 'Data Mining Techniques', 'material_type': 'reading', 'description': 'Advanced data mining methods'},
                    {'title': 'Analytics Project Templates', 'material_type': 'assignment', 'description': 'Project templates and guidelines'},
                ]
            },
            {
                'code': 'IT501',
                'name': 'Oracle Database Administration',
                'description': 'Advanced database administration using Oracle Database, including installation, configuration, and optimization.',
                'credits': 3,
                'level': '500',
                'course_type': 'elective',
                'max_students': 30,
                'syllabus': 'Week 1: Oracle Database Architecture\nWeek 2: Installation and Configuration\nWeek 3: User Management\nWeek 4: Backup and Recovery\nWeek 5: Performance Tuning\nWeek 6: Security Administration\nWeek 7: High Availability\nWeek 8: Data Guard\nWeek 9: RMAN Operations\nWeek 10: Database Monitoring\nWeek 11: Troubleshooting\nWeek 12: OCA Preparation',
                'learning_outcomes': '1. Install and configure Oracle Database\n2. Manage users and security\n3. Implement backup strategies\n4. Optimize database performance\n5. Configure high availability\n6. Prepare for Oracle certification',
                'semester': 'first',
                'year': 2024,
                'schedules': [
                    {'day_of_week': 'tuesday', 'start_time': '15:00', 'end_time': '16:30', 'room': '501', 'building': 'IT Building'},
                    {'day_of_week': 'thursday', 'start_time': '09:00', 'end_time': '12:00', 'room': 'Database Lab', 'building': 'IT Building', 'is_lab': True},
                ],
                'materials': [
                    {'title': 'Oracle Database Administration Guide', 'material_type': 'reading', 'description': 'Official Oracle DBA guide'},
                    {'title': 'Database Performance Tuning', 'material_type': 'reading', 'description': 'Performance optimization techniques'},
                    {'title': 'Oracle Lab Exercises', 'material_type': 'assignment', 'description': 'Hands-on Oracle exercises'},
                ]
            }
        ]
        
        created_courses = []
        
        for course_data in courses_data:
            schedules_data = course_data.pop('schedules')
            materials_data = course_data.pop('materials')
            
            # Create course
            course, created = Course.objects.get_or_create(
                code=course_data['code'],
                defaults={**course_data, 'lecturer': lecturer}
            )
            
            if created:
                created_courses.append(course)
                self.stdout.write(f'Created course: {course.code} - {course.name}')
                
                # Create schedules
                for schedule_data in schedules_data:
                    start_time = time.fromisoformat(schedule_data['start_time'])
                    end_time = time.fromisoformat(schedule_data['end_time'])
                    
                    CourseSchedule.objects.create(
                        course=course,
                        day_of_week=schedule_data['day_of_week'],
                        start_time=start_time,
                        end_time=end_time,
                        room=schedule_data['room'],
                        building=schedule_data['building'],
                        is_lab=schedule_data.get('is_lab', False)
                    )
                
                # Create materials
                for material_data in materials_data:
                    CourseMaterial.objects.create(
                        course=course,
                        uploaded_by=lecturer,
                        **material_data
                    )
            else:
                self.stdout.write(f'Course already exists: {course.code}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(created_courses)} courses!')
        ) 