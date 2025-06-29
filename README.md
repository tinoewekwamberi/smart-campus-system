# Smart Campus System – Local Setup & Testing Guide

## Prerequisites

- **Python 3.10+**
- **Node.js 18+ & npm**
- **MySQL Server** (8.x recommended)
- **Git** (optional, for cloning)

---

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SCMS
```

---

## 2. Backend Setup (Django)

### a. Create and Activate Virtual Environment

```bash
cd backend
python -m venv ../venv
# On Windows CMD
..\venv\Scripts\activate.bat
# On PowerShell
..\venv\Scripts\Activate.ps1
# On Git Bash
source ../venv/Scripts/activate
```

### b. Install Python Dependencies

```bash
pip install -r requirements.txt
```
If you don't have a `requirements.txt`, run:
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pymysql cryptography python-dotenv
```

### c. MySQL Database Setup

1. **Create a database and user in MySQL:**
   ```sql
   CREATE DATABASE scms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'tinoewekwamberi'@'localhost' IDENTIFIED BY 'yourpassword';
   GRANT ALL PRIVILEGES ON scms_db.* TO 'tinoewekwamberi'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Update `backend/backend/.env` with your DB credentials.**

### d. Generate a Django SECRET_KEY

You can generate a secure secret key for your `.env` file using the provided script:

```bash
python generate_secret.py >> backend/.env
```

This will append a new `SECRET_KEY=...` line to your `.env` file.

### e. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### f. Start the Backend Server

```bash
python manage.py runserver
```

---

## 3. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

---

## 4. Access the App

- Backend: [http://localhost:8000/](http://localhost:8000/)
- Frontend: [http://localhost:5173/](http://localhost:5173/) (or as shown in your terminal)

---

## 5. Environment Variables

- For production, use environment variables or a `.env` file for secrets and DB credentials.

---

## 6. .gitignore Example

```
venv/
__pycache__/
*.pyc
db.sqlite3
.env
*.log
node_modules/
frontend/dist/
```

---

## 7. Creating a Superuser (optional)

```bash
python manage.py createsuperuser
```

---

## 8. Troubleshooting

- Make sure your MySQL server is running and accessible.
- If you see "access denied" errors, check your DB user privileges.
- If you see "module not found" errors, ensure your virtual environment is activated.

---

## 9. Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 10. License

MIT

---

## 4. Testing the App

- **Register a new user** (choose a role: student, faculty, staff).
- **Login** with your credentials.
- **View the dashboard** (basic info for now).
- **Logout** and try logging in again.
- **(Optional)**: Access Django admin at `http://localhost:8000/admin/` with your superuser.

---

## 5. Troubleshooting

- **CORS errors?**  
  Ensure `django-cors-headers` is installed and configured in `settings.py`.
- **MySQL connection errors?**  
  Double-check your database credentials and that MySQL is running.
- **Migrations issues?**  
  Ensure all migration files except `__init__.py` are deleted if resetting, and the MySQL database is empty.

---

## 6. Next Steps

- Implement role-based dashboards and navigation.
- Add more backend endpoints and frontend pages as per requirements.

---

**Happy coding!** 