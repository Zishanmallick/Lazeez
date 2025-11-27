
import React from 'react';
import { Restaurant } from '../types';
import { Star, Timer, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block hover:scale-95 transition-transform duration-200">
      <div className="relative w-full aspect-[5/3] rounded-2xl overflow-hidden mb-3 shadow-sm">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {restaurant.discount && (
          <div className="absolute bottom-3 left-3 text-white font-extrabold text-xl tracking-tighter flex items-end gap-2">
             <div className="mb-1 bg-blue-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm uppercase">Promoted</div>
             {restaurant.discount}
          </div>
        )}
        
        <div className="absolute top-0 right-0 bg-gray-100/90 backdrop-blur-sm px-2 py-1 rounded-bl-lg">
             <div className="text-[10px] font-bold text-gray-500">35 min</div>
        </div>
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-gray-800 truncate w-2/3">{restaurant.name}</h3>
          <div className="bg-green-700 text-white px-1.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-0.5 shadow-sm">
            {restaurant.rating} <Star size={10} fill="currentColor" />
          </div>
        </div>
        
        <div className="flex justify-between items-start text-sm text-gray-500">
           <p className="truncate w-2/3">{restaurant.cuisineTags.join(", ")}</p>
           <p>₹{restaurant.costForTwo} for two</p>
        </div>

        <div className="flex justify-end items-center gap-2 mt-2 text-xs text-gray-400 font-medium border-t border-dashed border-gray-200 pt-2">
           <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-purple-500" />
              <span className="text-purple-500 text-[10px] uppercase font-bold">9000+ orders placed recently</span>
           </div>
        </div>
      </div>
    </Link>
  );
};
