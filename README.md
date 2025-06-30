# Smart Campus Management System (SCMS)

A comprehensive campus management system built with Django (Backend) and React (Frontend) using Mantine UI components.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for Students, Lecturers, and Staff roles
- **User Profile Management**: Edit personal info, upload profile picture, change password, and manage role-specific data (students, lecturers, staff)
- **Responsive Design**: Modern UI built with Mantine components
- **Real-time Notifications**: Push notifications for important updates
- **Mental Health Check-ins**: Student wellness monitoring system

## 👤 User Profile Management

The SCMS includes a comprehensive user profile management system:

- **Personal Information**: Edit name, phone, address, department, and bio.
- **Profile Picture**: Upload and update your profile photo.
- **Account Settings**: Change password, view account details, and see security info.
- **Role-Specific Info**: Students, lecturers, and staff can manage academic, teaching, or administrative details relevant to their role.
- **Navigation**: The Profile page is accessible from the sidebar navigation. **The Profile link now appears as the last item in the sidebar for all user roles.**
- **Responsive**: Fully mobile-friendly and consistent with the rest of the app.

**How to use:**
1. Click the **Profile** link in the sidebar (last item).
2. Use the tabs to manage your personal info, account settings, and role-specific data.
3. Changes are saved instantly and reflected across the system.

### Planned Features
- **Grade Management**: Track and manage student grades
- **Study Plans**: Academic planning and course management
- **Student Support**: Support ticket system and resources
- **Analytics Dashboard**: Data visualization and reporting

## 🛠️ Tech Stack

### Backend
- **Django 5.2.3**: Web framework
- **Django REST Framework**: API development
- **SimpleJWT**: JWT authentication
- **MySQL**: Database
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Mantine**: UI component library
- **Axios**: HTTP client

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/tinoewekwamberi/smart-campus-system.git
cd smart-campus-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
SCMS/
├── backend/                 # Django backend
│   ├── accounts/           # Authentication app
│   ├── users/              # User management app
│   ├── backend/            # Django settings
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=scms_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure production database
3. Set up static files serving
4. Use Gunicorn or uWSGI

### Frontend Deployment
1. Build the project: `npm run build`
2. Serve static files from a web server
3. Configure environment variables

## 🤝 Contributing

### Git Workflow
1. **Create a feature branch**: `git checkout -b feature/feature-name`
2. **Make changes**: Write your code and tests
3. **Commit changes**: Use conventional commit messages
4. **Push to remote**: `git push origin feature/feature-name`
5. **Create Pull Request**: Submit for review

### Commit Message Convention
```
type(scope): description

Examples:
feat(auth): add JWT authentication
fix(ui): resolve login form styling issue
docs(readme): update installation instructions
refactor(api): optimize user endpoint
test(auth): add authentication tests
```

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **React**: Follow functional component patterns
- **Django**: Follow Django best practices

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh token
- `POST /api/accounts/register/` - User registration
- `GET /api/accounts/user-info/` - Get user info

### User Management
- `GET /api/users/` - List users (Admin only)
- `POST /api/users/` - Create user (Admin only)
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (Admin only)

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Database Schema

### Users
- `CustomUser`: Extended user model with roles
- Roles: Student, Lecturer, Staff

### Planned Models
- `Course`: Course information
- `Grade`: Student grades
- `StudyPlan`: Academic plans
- `MentalHealthCheck`: Wellness check-ins
- `Notification`: System notifications

## 🔒 Security

- JWT token authentication
- Role-based access control
- CORS configuration
- Environment variable protection
- SQL injection prevention (Django ORM)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Role-based access
- [x] Basic UI components

### Phase 2: Academic Management
- [ ] Course management
- [ ] Grade tracking
- [ ] Study plans

### Phase 3: Student Support
- [ ] Mental health check-ins
- [ ] Support ticket system
- [ ] Resource library

### Phase 4: Analytics & Reporting
- [ ] Dashboard analytics
- [ ] Performance reports
- [ ] Data visualization

---

**Built with ❤️ by the SCMS Development Team** 