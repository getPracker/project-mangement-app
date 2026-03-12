import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is logged in, show the component (Outlet)
  // Otherwise, redirect to /login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;