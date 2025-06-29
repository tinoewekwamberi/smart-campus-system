import StudentDashboard from './StudentDashboard';
import LecturerDashboard from './LecturerDashboard';
import StaffDashboard from './StaffDashboard';

export default function MainDashboard({ user }) {
  // Render the appropriate dashboard based on user role
  switch (user?.role) {
    case 'student':
      return <StudentDashboard user={user} />;
    case 'lecturer':
      return <LecturerDashboard user={user} />;
    case 'staff':
      return <StaffDashboard user={user} />;
    default:
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Welcome to SCMS!</h2>
          <p>Please contact an administrator to assign your role.</p>
        </div>
      );
  }
} 