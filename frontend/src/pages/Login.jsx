import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../schemas/authSchemas';
import { login, reset } from '../features/auth/authSlice';
import { demoUsers } from '../config/demoUsers';
import Spinner from '../components/Spinner';

function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) console.error(message);
    if (isSuccess || user) navigate('/dashboard');
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    return () => dispatch(reset());
  }, [dispatch]);

  const handleSelectDemo = (e) => {
    const selected = demoUsers.find(u => u.label === e.target.value);
    if (selected) {
      // Programmatically update inputs so react-hook-form validates them
      setValue('email', selected.email, { shouldValidate: true, shouldDirty: true });
      setValue('password', selected.password, { shouldValidate: true, shouldDirty: true });
    }
  };

  if (isLoading) return <Spinner message="Signing in..." />;

  return (
    <div className="py-10 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Login</h1>

        {/* Demo Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quick Fill Demo User:</label>
          <select onChange={handleSelectDemo} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select a user...</option>
            {demoUsers.map((u) => (
              <option key={u.email} value={u.label}>{u.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="Enter your email"
            />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="Enter your password"
            />
            <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
          </div>

          {isError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || !isDirty}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;