import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm z-50">
      {/* Title */}
      <Link to="/" className="text-xl font-black text-blue-600 tracking-tight">
        Project Management App
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        {/* New Projects Tab - Only show if logged in */}
        {user && (
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Dashboard
          </Link>
        )}

        {user ? (
          // Show Logout if user is logged in
          <button
            onClick={onLogout}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg font-medium transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>Logout</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-500">{user.name}</span>
          </button>
        ) : (
          // Show Login/Sign In if user is not logged in
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;