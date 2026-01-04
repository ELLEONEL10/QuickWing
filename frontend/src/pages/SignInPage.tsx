import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex-grow container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-slate-700 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-accent"></div>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to access your bookings</p>
        </div>

        <form className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-brand-blue focus:ring-brand-blue" />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-brand-blue dark:text-blue-400 font-bold hover:underline">Forgot password?</a>
            </div>

            <button type="button" className="w-full bg-brand-blue hover:bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <a href="#" className="text-brand-blue dark:text-blue-400 font-bold hover:underline">Create account</a>
        </div>
      </div>
    </div>
  );
};
