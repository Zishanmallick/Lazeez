
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(name, email);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
       <div className="w-full md:w-1/2 bg-gray-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
             <img src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
             <div className="mb-8">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-arabic tracking-wide">
                   Lazeez
                </span>
             </div>
             <h1 className="text-4xl font-bold mb-4">Welcome Back to Delhi's Food Paradise</h1>
             <p className="text-gray-300">Order from your favorite restaurants in Khan Market, Old Delhi, and more.</p>
          </div>
          <div className="relative z-10 text-sm text-gray-400">© 2025 Lazeez Inc.</div>
       </div>

       <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
             <h2 className="text-3xl font-bold mb-2 text-gray-900">Login</h2>
             <p className="text-gray-500 mb-8">Enter your details to continue</p>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                   <input 
                     type="text" 
                     required
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                     placeholder="e.g. Rahul Sharma"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                     placeholder="rahul@example.com"
                   />
                </div>

                <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                   Start Ordering <ArrowRight size={20} />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};
