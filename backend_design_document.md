
# Backend Design Document for Smart Campus System

## 1. Introduction
The backend system handles data processing, logic, and integration with the frontend and database. It uses Flask as the framework for API development and data management.

### Purpose
- Handle authentication and user roles.
- Process student data, grades (including actual values), and performance analytics.
- Generate study plans and mental health check-ins.
- Integrate with other campus systems like Moodle.

### Chosen Framework
Flask was chosen due to its scalability, flexibility, and compatibility with Python-based tools like SQLAlchemy for ORM, making it ideal for data-driven applications.

## 2. System Architecture
The backend is divided into three main layers:
- **API Layer**: Manages requests from the frontend and returns responses.
- **Logic Layer**: Handles the core functionality (e.g., processing grades, creating study plans).
- **Data Access Layer**: Interacts with the database using SQLAlchemy.

## 3. Database Integration
SQLAlchemy is used as the ORM to connect the backend to the database (PostgreSQL/MySQL).

### Modules and Endpoints
- **Authentication**: Endpoints for user login, registration, and JWT token generation.
- **Student Data Processing**: Endpoints for handling grades (including actual values) and performance metrics.
- **Study Plans**: Generate study plans based on student performance.
- **Mental Health Check-ins**: Track student mental health status. This will be integrated with a chatbot that provides mental health support to students.
- **Notifications**: Send alerts for deadlines, check-ins, and system updates.
- **Student Support**: Provide a student support system for accessing resources, mental health help, and academic guidance.

## 4. Security Considerations
- **Role-based access control**: Different roles for students, faculty, and staff.
- **Data Encryption**: Sensitive data such as passwords will be encrypted.
- **API Security**: Implement rate limiting, input validation, and authentication checks.

## 5. Scalability and Maintenance
- The system is designed to scale horizontally if needed by using microservices.
- Future mobile app support is planned.
    