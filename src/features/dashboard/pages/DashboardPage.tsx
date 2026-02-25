import AdminDashboard from '@/features/dashboard/components/AdminDashboard';
import InstructorDashboard from '@/features/dashboard/components/InstructorDashboard';
import StudentDashboard from '@/features/dashboard/components/StudentDashboard';
import { useAuth } from '@/shared/providers/AuthProvider';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      default:
        return <div className="p-4 text-center">Cargando...</div>;
    }
  };
  return (
    <div className='p-6'>
      {renderDashboard()}
    </div>
  )
}

export default DashboardPage