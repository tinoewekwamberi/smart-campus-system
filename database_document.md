
# Database Document for Smart Campus System

## 1. Database Schema

### Tables

- **Users**:
    - **UserID** (Primary Key)
    - **Username**
    - **Password** (hashed)
    - **Role** (student, faculty, staff)

- **Grades**:
    - **GradeID** (Primary Key)
    - **StudentID** (Foreign Key)
    - **CourseID** (Foreign Key)
    - **Grade** (Actual grade value, e.g., "B", "A", "90%")
    - **GradeValue** (Actual numeric value of the grade, e.g., 85 for "B")

- **Courses**:
    - **CourseID** (Primary Key)
    - **CourseName**
    - **Department**
    - **InstructorID** (Foreign Key)

- **Study Plans**:
    - **PlanID** (Primary Key)
    - **StudentID** (Foreign Key)
    - **PlanDate**
    - **PlanDetails**

- **Mental Health Check-ins**:
    - **CheckinID** (Primary Key)
    - **StudentID** (Foreign Key)
    - **CheckinDate**
    - **Mood**
    - **StressLevel**
    - **ChatbotInteraction** (Text field or log of chatbot interaction for mental health support)

- **Notifications**:
    - **NotificationID** (Primary Key)
    - **UserID** (Foreign Key)
    - **Message**
    - **Timestamp**
    - **ReadStatus**

- **Student Support**:
    - **SupportRequestID** (Primary Key)
    - **StudentID** (Foreign Key)
    - **SupportType** (academic, mental health, etc.)
    - **RequestDate**
    - **Status** (pending, resolved, etc.)

### Relationships
- **Users** to **Grades**: One-to-many.
- **Courses** to **Grades**: One-to-many.
- **Users** to **Notifications**: One-to-many.
- **Users** to **Student Support**: One-to-many.

## 2. SQL Dump
```sql
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50)
);

CREATE TABLE Courses (
    CourseID SERIAL PRIMARY KEY,
    CourseName VARCHAR(255) NOT NULL,
    Department VARCHAR(255),
    InstructorID INTEGER
);

CREATE TABLE Grades (
    GradeID SERIAL PRIMARY KEY,
    StudentID INTEGER REFERENCES Users(UserID),
    CourseID INTEGER REFERENCES Courses(CourseID),
    Grade VARCHAR(10),
    GradeValue DECIMAL(5,2)
);

CREATE TABLE StudyPlans (
    PlanID SERIAL PRIMARY KEY,
    StudentID INTEGER REFERENCES Users(UserID),
    PlanDate DATE,
    PlanDetails TEXT
);

CREATE TABLE MentalHealthCheckins (
    CheckinID SERIAL PRIMARY KEY,
    StudentID INTEGER REFERENCES Users(UserID),
    CheckinDate DATE,
    Mood VARCHAR(50),
    StressLevel VARCHAR(50),
    ChatbotInteraction TEXT
);

CREATE TABLE Notifications (
    NotificationID SERIAL PRIMARY KEY,
    UserID INTEGER REFERENCES Users(UserID),
    Message TEXT,
    Timestamp TIMESTAMP,
    ReadStatus BOOLEAN
);

CREATE TABLE StudentSupport (
    SupportRequestID SERIAL PRIMARY KEY,
    StudentID INTEGER REFERENCES Users(UserID),
    SupportType VARCHAR(50),
    RequestDate DATE,
    Status VARCHAR(50)
);
```
    