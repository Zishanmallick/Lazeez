
import React, { useState, useMemo, useEffect } from 'react';
import { FOOD_CATEGORIES, RESTAURANTS } from '../constants';
import { Restaurant } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { Sparkles, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { useLocationContext } from './LocationContext';

export const Home: React.FC = () => {
  const { selectedLocation, searchQuery } = useLocationContext();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterRating, setFilterRating] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterFast, setFilterFast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        // Attempt to fetch from Python Backend
        const response = await fetch(`http://localhost:8000/restaurants${selectedLocation !== 'All Locations' ? `?location=${selectedLocation}` : ''}`);
        if (response.ok) {
          const data = await response.json();
          // If backend returns empty list (e.g. fresh DB), treat as error to trigger fallback
          if (Array.isArray(data) && data.length > 0) {
            setRestaurants(data);
          } else {
            throw new Error("Backend data empty");
          }
        } else {
          throw new Error("Backend response not ok");
        }
      } catch (error) {
        // Fallback to local constants if backend is offline or empty
        console.warn("Backend offline or empty, switching to local data mode.");
        let localData = RESTAURANTS;
        if (selectedLocation !== 'All Locations') {
          localData = localData.filter(r => r.location === selectedLocation);
        }
        setRestaurants(localData);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedLocation]);

  // Get all unique cuisine tags from restaurants
  const allCuisines = useMemo(() => {
    const tags = new Set<string>();
    restaurants.forEach(r => {
      r.cuisineTags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [restaurants]);

  let filteredRestaurants = restaurants;

  // Apply Search Query Filter (Name, Tags, or Menu Item matches)
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) || 
      r.cuisineTags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      r.menu.some(m => m.name.toLowerCase().includes(lowerQuery))
    );
  }

  // Apply Category Filter
  if (selectedCategory) {
    filteredRestaurants = filteredRestaurants.filter(r => 
      r.cuisineTags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // Apply client-side filters
  if (filterRating) {
    filteredRestaurants = filteredRestaurants.filter(r => r.rating >= 4.5);
  }
  if (filterVeg) {
    filteredRestaurants = filteredRestaurants.filter(r => r.menu.some(m => m.isVeg));
  }
  if (filterFast) {
     filteredRestaurants = filteredRestaurants.slice(0, 5);
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Carousel (Mind Saver) */}
      <div className="bg-gray-50/50 py-10 border-b border-gray-100">
         <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-800 mb-8 tracking-tight">Inspiration for your first order</h2>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {FOOD_CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(prev => prev === cat.name ? null : cat.name)}
                    className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer snap-start group outline-none"
                  >
                     <div className={`w-36 h-36 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all ${selectedCategory === cat.name ? 'ring-4 ring-red-500 scale-105' : ''}`}>
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                     </div>
                     <span className={`font-semibold text-lg ${selectedCategory === cat.name ? 'text-red-600' : 'text-gray-700'}`}>{cat.name}</span>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Main Restaurant Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-gray-900">
             {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedLocation === 'All Locations' ? 'Top Brands for you' : `Delivery Restaurants in ${selectedLocation}`
             }
           </h2>
           {selectedCategory && (
             <button onClick={() => setSelectedCategory(null)} className="text-red-600 flex items-center gap-1 text-sm font-medium hover:underline">
                Clear "{selectedCategory}" <X size={16} />
             </button>
           )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-8 sticky top-20 z-30 bg-white py-2 items-center">
           <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 shadow-sm">
              Filters <SlidersHorizontal size={14} />
           </button>
           
           {/* Cuisine Filter Dropdown */}
           <div className="relative group">
             <select 
               value={selectedCategory || ''}
               onChange={(e) => setSelectedCategory(e.target.value || null)}
               className={`appearance-none pl-4 pr-8 py-2 rounded-full border font-medium text-sm shadow-sm transition-colors cursor-pointer focus:outline-none ${selectedCategory ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}
             >
               <option value="">Cuisines</option>
               {allCuisines.map(cuisine => (
                 <option key={cuisine} value={cuisine}>{cuisine}</option>
               ))}
             </select>
             <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${selectedCategory ? 'text-red-500' : 'text-gray-500'}`} />
           </div>

           <button 
             onClick={() => setFilterRating(!filterRating)}
             className={`px-4 py-2 rounded-full border font-medium text-sm shadow-sm transition-colors ${filterRating ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 bg-white'}`}
           >
              Ratings 4.5+
           </button>
           <button 
             onClick={() => setFilterVeg(!filterVeg)}
             className={`px-4 py-2 rounded-full border font-medium text-sm shadow-sm transition-colors ${filterVeg ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 bg-white'}`}
           >
              Pure Veg
           </button>
           <button 
             onClick={() => setFilterFast(!filterFast)}
             className={`px-4 py-2 rounded-full border font-medium text-sm shadow-sm transition-colors ${filterFast ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 bg-white'}`}
           >
              Fast Delivery
           </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-red-600 w-10 h-10" />
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <p className="text-gray-400 text-lg">No restaurants found matching your criteria.</p>
             <button onClick={() => {setSelectedCategory(null); setFilterRating(false); setFilterVeg(false);}} className="text-red-600 font-bold mt-2 hover:underline">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};
