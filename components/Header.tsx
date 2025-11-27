
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShoppingBag, Sparkles, LogOut, User as UserIcon, Search, ChevronDown } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useLocationContext } from './LocationContext';
import { LOCATIONS } from '../constants';
import { DelhiLocation } from '../types';

export const Header: React.FC = () => {
  const { items } = useCart();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { selectedLocation, setSelectedLocation, searchQuery, setSearchQuery } = useLocationContext();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-md z-50 px-4 lg:px-16 flex items-center justify-between">
      <div className="flex items-center gap-4 lg:gap-8 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 gap-2 group">
           <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-amber-600 font-arabic pt-2 tracking-wide group-hover:scale-105 transition-transform duration-300">
             Lazeez
           </span>
        </Link>

        {/* Location & Search Container */}
        <div className="hidden md:flex items-center flex-1 bg-white rounded-lg shadow-sm border border-gray-200 h-12 max-w-3xl ml-8">
          {/* Location */}
          <div className="flex items-center gap-2 px-3 py-2 border-r border-gray-200 cursor-pointer min-w-[200px] relative group">
             <MapPin size={20} className="text-red-500" />
             <select 
                className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer appearance-none w-full text-sm truncate"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as DelhiLocation)}
             >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
             </select>
             <ChevronDown size={16} className="text-gray-500 absolute right-3 pointer-events-none" />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 flex items-center px-4">
             <Search size={18} className="text-gray-400 mr-3" />
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurant, cuisine or a dish" 
                className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
             />
          </div>
        </div>

        {/* Right Actions */}
        <nav className="flex items-center gap-6 ml-auto flex-shrink-0">
          <Link 
            to="/recommendations" 
            className={`hidden lg:flex items-center gap-2 transition-colors hover:text-red-500 ${location.pathname === '/recommendations' ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Sparkles size={18} />
            <span className="text-lg font-light">AI Guide</span>
          </Link>
          
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer hover:text-red-500 text-gray-600">
             <UserIcon size={20} />
             <div className="hidden md:block leading-tight">
                <div className="text-sm font-semibold">{user?.name.split(' ')[0]}</div>
             </div>
          </Link>

          <Link to="/track-order" className="flex items-center gap-2 hover:text-red-500 text-gray-600 group">
            <div className="relative">
               <ShoppingBag size={20} />
               {items.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                   {items.length}
                 </span>
               )}
            </div>
            <span className="hidden md:block font-medium">Cart</span>
          </Link>

          <button onClick={logout} className="text-gray-400 hover:text-red-500">
             <LogOut size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
};
