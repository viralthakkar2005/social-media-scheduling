import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInSchema } from '../validation/authSchema.js';

export default function SignIn({ onNavigate }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  });

  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      navigate('/'); // change to whatever your protected route is
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Branding Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a
          href="#"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          className="inline-flex items-center gap-2"
        >
          <img
            src="src/assets/logo.png"
            alt="Post Bridge Logo"
            className="h-9 w-auto"
          />
          <span className="font-bold text-2xl text-navy tracking-tight">post bridge</span>
        </a>
        <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage and schedule your social media posts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-2xl sm:px-10">
          {/* Google Login Button */}
          <div>
            <button
              type="button"
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
              <span className="bg-white px-3 text-gray-400 font-medium">Or sign in with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-navy uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-post-green hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-post-green focus:ring-post-green'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-post-green focus:ring-post-green border-gray-300 rounded accent-[#5bc983]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in to Dashboard'}
                {!isSubmitting && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer switch prompt */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to='/sign-up'
            className="font-semibold text-navy hover:text-post-green transition-colors"
          >
            Start for free
          </Link>
        </p>
      </div>
    </div>
  );
}
