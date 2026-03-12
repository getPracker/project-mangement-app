import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register as registerUser, reset } from '../features/auth/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../schemas/authSchemas';
import Spinner from '../components/Spinner';

function Register() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty } 
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) console.error(message);
    if (isSuccess || user) navigate('/dashboard');
    return () => dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    // Only name, email, and password are sent to your API
    dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
  };

  if (isLoading) return <Spinner message="Creating account..." />;

  return (
    <div className="py-10 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Create Account</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register('name')} className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} placeholder="Enter your name" />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} placeholder="Enter your email" />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register('password')} type="password" className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} placeholder="Enter password" />
            <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input {...register('confirmPassword')} type="password" className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} placeholder="Confirm password" />
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
          </div>

          <button
            type="submit"
            disabled={!isValid || !isDirty}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;