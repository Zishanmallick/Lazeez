
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, MapPin, Utensils } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-amber-600 font-arabic tracking-wide pt-2">
             Lazeez
          </span>
        </div>
        <div className="flex gap-4">
           <Link to="/login" className="px-6 py-2 rounded-full border border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors font-medium">Log in</Link>
           <Link to="/login" className="px-6 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-grow flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-12">
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Delhi's <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600 font-arabic px-1">Legendary</span> Flavors, Delivered.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            From the narrow lanes of Jama Masjid to the upscale cafes of Khan Market. 
            We deliver authentic food from Delhi's most iconic restaurants straight to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/login" className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all hover:scale-105 text-center">
               Get Started
             </Link>
             <div className="px-8 py-4 bg-gray-50 text-gray-700 text-lg font-bold rounded-xl border border-gray-100 flex items-center gap-2 justify-center">
               <MapPin className="text-red-500" /> Only in NCR
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
             <div>
                <div className="text-3xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-500">Iconic Spots</div>
             </div>
             <div>
                <div className="text-3xl font-bold text-gray-900">30m</div>
                <div className="text-sm text-gray-500">Avg Delivery</div>
             </div>
             <div>
                <div className="text-3xl font-bold text-gray-900">AI</div>
                <div className="text-sm text-gray-500">Food Guide</div>
             </div>
          </div>
        </div>

        <div className="lg:w-1/2 relative">
           <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-orange-50 rounded-[3rem] transform rotate-6"></div>
           <img 
             src="https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=1000&q=80" 
             alt="Delicious Indian Food" 
             className="relative rounded-[2.5rem] shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500"
           />
           
           <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-in">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                 <Utensils className="text-green-600" size={24} />
              </div>
              <div>
                 <div className="text-sm text-gray-500">Famous For</div>
                 <div className="font-bold text-gray-900">Butter Chicken</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
