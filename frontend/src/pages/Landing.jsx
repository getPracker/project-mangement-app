// src/pages/Landing.jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Landing() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
        Streamline your <span className="text-blue-600">Workflow</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-lg mb-8">
        Manage projects, track tasks, and collaborate with your team in one centralized hub.
      </p>
      
      {user ? (
        <Link to="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Go to Dashboard
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}
export default Landing;