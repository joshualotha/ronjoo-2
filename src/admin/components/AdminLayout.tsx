import { Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAdmin();

  // On refresh, `user` is initially null until `adminMe()` resolves.
  // Don't redirect to login while auth is still loading.
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/kijani-desk/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-canvas">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]" style={{ backgroundColor: '#F5F0E8' }}>
        <Outlet />
      </div>
    </div>
  );
}
