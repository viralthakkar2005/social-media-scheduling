import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema } from '../validation/authSchema';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur', // validate when a field loses focus, then re-validate onChange after first error
  });

  const onSubmit = async (data) => {
    try {

      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // tells browser to send/accept cookies cross-origin
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      login(result.user);
      navigate('/dashboard/new-post');
    } catch (err) {
      console.error(err.message); // wire to a toast/error UI next
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Branding Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to='/'
          className="inline-flex items-center gap-2"
        >
          <img
            src="src/assets/logo.png"
            alt="Post Bridge Logo"
            className="h-9 w-auto"
          />
          <span className="font-bold text-2xl text-navy tracking-tight">post bridge</span>
        </Link>

        <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Easy to use, fairly priced social scheduling. No credit card required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-2xl sm:px-10">
          {/* Google Sign Up Button */}
          <div>
            <button
              type="button"
              onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google'; }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-post-green cursor-pointer"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400 font-medium">Or register with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="full-name" className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Jack Smith"
                  {...register('fullName')}
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${errors.fullName
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-post-green focus:ring-post-green'
                    }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${errors.email
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-post-green focus:ring-post-green'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${errors.password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-post-green focus:ring-post-green'
                    }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${errors.confirmPassword
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-post-green focus:ring-post-green'
                    }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms')}
                    className="h-4 w-4 text-post-green focus:ring-post-green border-gray-300 rounded accent-[#5bc983]"
                  />
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  I agree to post bridge's{' '}
                  <a href="#" className="text-navy underline hover:text-post-green">Terms of Service</a> and{' '}
                  <a href="#" className="text-navy underline hover:text-post-green">Privacy Policy</a>.
                </div>
              </div>
              {errors.terms && (
                <p className="mt-1.5 text-xs text-red-500">{errors.terms.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create free account'}
                {!isSubmitting && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer switch prompt */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className="font-semibold text-navy hover:text-post-green transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
