
import React from 'react';
import { MenuItem } from '../types';
import { useCart } from './CartContext';
import { Star } from 'lucide-react';

interface Props {
  item: MenuItem;
}

export const DishCard: React.FC<Props> = ({ item }) => {
  const { addToCart, removeFromCart, items } = useCart();
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white p-4 pb-8 border-b border-gray-200 last:border-0 flex justify-between gap-4 h-full">
       <div className="flex flex-col justify-between flex-1 pr-2">
          <div>
            <div className={`w-4 h-4 border flex items-center justify-center rounded-sm mb-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{item.name}</h3>
            <div className="font-medium text-gray-700 mb-2">₹{item.price}</div>
            
            {item.votes && (
              <div className="flex items-center gap-1 mb-3">
                 <div className="flex gap-0.5">
                   <Star size={12} className="text-yellow-400 fill-yellow-400" />
                   <Star size={12} className="text-yellow-400 fill-yellow-400" />
                   <Star size={12} className="text-yellow-400 fill-yellow-400" />
                   <Star size={12} className="text-yellow-400 fill-yellow-400" />
                 </div>
                 <span className="text-xs text-gray-400 font-medium">{item.votes} votes</span>
              </div>
            )}
            
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
       </div>
       
       <div className="relative w-32 h-32 flex-shrink-0">
          {item.image ? (
             <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
             <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">No Image</div>
          )}
          
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
             {quantity === 0 ? (
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-white text-green-600 border border-gray-300 shadow-md font-extrabold px-8 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  ADD
                </button>
             ) : (
                <div className="flex items-center bg-white text-green-600 border border-gray-300 shadow-md rounded-lg font-bold h-9">
                   <button className="px-3 hover:bg-gray-100 rounded-l-lg text-lg" onClick={() => removeFromCart(item.id)}>-</button>
                   <span className="px-1 text-sm">{quantity}</span>
                   <button className="px-3 hover:bg-gray-100 rounded-r-lg text-lg" onClick={() => addToCart(item)}>+</button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
