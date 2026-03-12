import * as Yup from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

// Export your registration schema (from before) and add a login one
export const registerSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name too short').max(50, 'Max 50 chars'),
  email: Yup.string().email('Invalid email').max(80, 'Max 80 chars').required('Email is required'),
  password: Yup.string().required('Password is required').matches(passwordRegex, 'Password does not meet complexity requirements'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
});

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});