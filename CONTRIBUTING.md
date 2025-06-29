# Contributing to Smart Campus Management System

Thank you for your interest in contributing to SCMS! This document provides guidelines and best practices for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Initial Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/smart-campus-system.git`
3. Add upstream: `git remote add upstream https://github.com/tinoewekwamberi/smart-campus-system.git`
4. Create a virtual environment and install dependencies (see README.md)

## 🔄 Git Workflow

### 1. Branch Naming Convention
```
feature/feature-name          # New features
bugfix/bug-description        # Bug fixes
hotfix/critical-fix           # Critical fixes
docs/documentation-update     # Documentation changes
refactor/component-name       # Code refactoring
test/test-description        # Adding tests
```

### 2. Development Process
```bash
# 1. Update your main branch
git checkout main
git pull upstream main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... code, code, code ...

# 4. Stage your changes
git add .

# 5. Commit with conventional commit message
git commit -m "feat(auth): add role-based navigation"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Create a Pull Request
```

### 3. Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

#### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples:
```
feat(auth): add JWT token refresh functionality
fix(ui): resolve login form validation error
docs(readme): update installation instructions
refactor(api): optimize user endpoint performance
test(auth): add authentication unit tests
chore(deps): update Django to 5.2.3
```

## 📝 Code Standards

### Python (Django) Standards
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions small and focused
- Use type hints where appropriate

```python
# Good example
def get_user_by_email(email: str) -> Optional[CustomUser]:
    """
    Retrieve a user by their email address.
    
    Args:
        email: The user's email address
        
    Returns:
        CustomUser instance if found, None otherwise
    """
    try:
        return CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return None
```

### JavaScript/React Standards
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful component and variable names
- Keep components small and focused
- Use PropTypes or TypeScript for type checking

```javascript
// Good example
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId, onUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      setLoading(true);
      const response = await api.getUser(id);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};
```

## 🧪 Testing Guidelines

### Backend Testing
- Write unit tests for all new functionality
- Use Django's TestCase for database tests
- Aim for at least 80% code coverage
- Test both success and error cases

```python
# Example test
from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': 'student'
        }

    def test_create_user(self):
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.role, 'student')
        self.assertTrue(user.check_password('testpass123'))
```

### Frontend Testing
- Write unit tests for components
- Test user interactions and state changes
- Use React Testing Library
- Mock API calls in tests

```javascript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login onLogin={jest.fn()} />);
  
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
```

## 🔍 Code Review Process

### Before Submitting a PR
1. **Self-review**: Review your own code
2. **Test locally**: Ensure all tests pass
3. **Check formatting**: Run linters and formatters
4. **Update documentation**: Update relevant docs
5. **Squash commits**: Clean up commit history

### PR Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design considerations
- [ ] Security considerations addressed

### Review Guidelines
- Be constructive and respectful
- Focus on code quality and functionality
- Suggest improvements when possible
- Approve only when satisfied with the code

## 🚀 Deployment Guidelines

### Development Environment
- Use `.env` files for local development
- Never commit sensitive information
- Use development databases
- Enable debug mode for development

### Production Environment
- Use environment variables for secrets
- Disable debug mode
- Use production database
- Set up proper logging
- Configure CORS properly

## 📋 Issue Guidelines

### Creating Issues
- Use clear, descriptive titles
- Provide detailed descriptions
- Include steps to reproduce
- Add screenshots if applicable
- Use appropriate labels

### Issue Templates
```
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 90]
- Version: [e.g., 1.0.0]

## Additional Information
Any other relevant information
```

## 🎯 Project Milestones

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Authentication system
- [x] Basic UI components
- [x] User management

### Phase 2: Core Features
- [ ] Role-based navigation
- [ ] Dashboard implementation
- [ ] Course management
- [ ] Grade tracking

### Phase 3: Advanced Features
- [ ] Mental health check-ins
- [ ] Notifications system
- [ ] Analytics dashboard
- [ ] Student support system

### Phase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Comprehensive testing
- [ ] Documentation completion

## 🤝 Team Communication

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code reviews and collaboration

### Meeting Guidelines
- Regular team meetings (weekly/bi-weekly)
- Document decisions and action items
- Share progress updates
- Address blockers promptly

## 📚 Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Mantine Documentation](https://mantine.dev/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### Tools
- **Code Editor**: VS Code with recommended extensions
- **API Testing**: Postman or Insomnia
- **Database**: MySQL Workbench or phpMyAdmin
- **Version Control**: Git with GitHub Desktop (optional)

## 🏆 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- GitHub contributors page
- Team acknowledgments

---

**Thank you for contributing to SCMS!** 🎉

For questions or clarifications, please open an issue or start a discussion. 