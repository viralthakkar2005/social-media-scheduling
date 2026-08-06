import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignUp({ onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
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
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-post-green cursor-pointer"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Sign up with Google</span>
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
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
                  name="fullName"
                  type="text"
                  required
                  placeholder="Jack Smith"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-post-green focus:ring-1 focus:ring-post-green transition-all"
                />
              </div>
            </div>

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
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-post-green focus:ring-1 focus:ring-post-green transition-all"
                />
              </div>
            </div>

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
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="At least 8 characters"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-post-green focus:ring-1 focus:ring-post-green transition-all"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-post-green focus:ring-post-green border-gray-300 rounded accent-[#5bc983]"
                />
              </div>
              <div className="ml-2 text-xs text-gray-500">
                I agree to post bridge's{' '}
                <a href="#" className="text-navy underline hover:text-post-green">Terms of Service</a> and{' '}
                <a href="#" className="text-navy underline hover:text-post-green">Privacy Policy</a>.
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-post-green rounded-full shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                Create free account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
