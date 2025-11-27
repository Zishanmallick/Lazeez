
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Star, MapPin, Clock, Info, Loader2 } from 'lucide-react';
import { DishCard } from './DishCard';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../constants';

export const RestaurantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:8000/restaurants/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
             setRestaurant(data);
          } else {
             throw new Error("Empty data from backend");
          }
        } else {
          throw new Error("Backend response not ok");
        }
      } catch (error) {
        console.warn("Backend offline or empty, switching to local data mode.");
        const localData = RESTAURANTS.find(r => r.id === id) || null;
        setRestaurant(localData);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-white shadow-sm sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
           {/* Breadcrumb */}
           <div className="text-xs text-gray-400 mb-4">Home / {restaurant.location} / <span className="text-gray-600">{restaurant.name}</span></div>
           
           <div className="flex justify-between items-start">
              <div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                 <p className="text-gray-500 text-sm mb-1">{restaurant.cuisineTags.join(", ")}</p>
                 <p className="text-gray-500 text-sm mb-4 flex items-center gap-1"><MapPin size={14} /> {restaurant.location}, 4.2 km</p>
                 
                 <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                       <Clock size={18} />
                       <span>{restaurant.deliveryTime || '35 min'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                       <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">₹</span>
                       <span>₹{restaurant.costForTwo} for two</span>
                    </div>
                 </div>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-2 flex flex-col items-center shadow-sm bg-white">
                 <div className="flex items-center gap-1 text-green-700 font-extrabold text-lg border-b border-gray-100 pb-2 mb-2 w-full justify-center">
                    <Star size={18} fill="currentColor" /> {restaurant.rating}
                 </div>
                 <div className="text-[10px] text-gray-500 font-medium tracking-tight">
                    1K+ ratings
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Deals Section Mockup */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
         <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[250px] bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200 flex items-center gap-3 cursor-pointer">
               <div className="bg-blue-600 text-white p-2 rounded-full"><Info size={20} /></div>
               <div>
                  <div className="font-bold text-gray-800">FLAT ₹125 OFF</div>
                  <div className="text-xs text-gray-500">USE CODE: LAZEEZ125</div>
               </div>
            </div>
            <div className="min-w-[250px] bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200 flex items-center gap-3 cursor-pointer">
               <div className="bg-orange-600 text-white p-2 rounded-full"><Info size={20} /></div>
               <div>
                  <div className="font-bold text-gray-800">20% OFF</div>
                  <div className="text-xs text-gray-500">UPTO ₹100</div>
               </div>
            </div>
         </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-800">Recommended</h2>
         </div>
         
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
           {restaurant.menu.map(item => (
             <DishCard key={item.id} item={item} />
           ))}
         </div>
      </div>
    </div>
  );
};
