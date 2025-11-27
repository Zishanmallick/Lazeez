
import React, { useMemo } from 'react';
import { useCart } from './CartContext';
import { CheckCircle2, User, Bike, Home, Clock, MapPin, Phone, UtensilsCrossed, Navigation, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OrderStatus } from '../types';

// Define specific waypoints for the "Map" route
// Coordinates are in percentages (0-100) of the container box
const MAP_WAYPOINTS = [
  { x: 10, y: 10 },  // 0: Driver Start
  { x: 80, y: 10 },  // 1: Turn 1
  { x: 80, y: 45 },  // 2: Restaurant Location (approx 45% progress)
  { x: 20, y: 45 },  // 3: Turn 2
  { x: 20, y: 80 },  // 4: Turn 3
  { x: 90, y: 80 }   // 5: Home Location (100% progress)
];

export const OrderTracker: React.FC = () => {
  const { items, cartTotal, activeOrder, deliveryProgress, clearActiveOrder, removeItemCompletely } = useCart();
  const navigate = useNavigate();

  // Function to calculate current bike position and bearing angle
  const getBikePosition = (progress: number) => {
    let start, end, localProgress;

    if (progress <= 45) {
       // Phase 1: 0-45% (To Restaurant)
       const p = progress / 45;
       if (p < 0.5) { // Segment 0 -> 1
          start = MAP_WAYPOINTS[0];
          end = MAP_WAYPOINTS[1];
          localProgress = p * 2;
       } else { // Segment 1 -> 2
          start = MAP_WAYPOINTS[1];
          end = MAP_WAYPOINTS[2];
          localProgress = (p - 0.5) * 2;
       }
    } else {
       // Phase 2: 45-100% (To Home)
       const p = (progress - 45) / 55;
       if (p < 0.33) { // Segment 2 -> 3
          start = MAP_WAYPOINTS[2];
          end = MAP_WAYPOINTS[3];
          localProgress = p * 3;
       } else if (p < 0.66) { // Segment 3 -> 4
          start = MAP_WAYPOINTS[3];
          end = MAP_WAYPOINTS[4];
          localProgress = (p - 0.33) * 3;
       } else { // Segment 4 -> 5
          start = MAP_WAYPOINTS[4];
          end = MAP_WAYPOINTS[5];
          localProgress = (p - 0.66) * 3;
       }
    }

    // Linear interpolation for X, Y
    const x = start.x + (end.x - start.x) * localProgress;
    const y = start.y + (end.y - start.y) * localProgress;

    // Calculate Bearing Angle for Rotation
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    // Math.atan2 returns radians where 0 is East (right). 
    // CSS rotation 0 is usually standard. 
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI);

    return { x, y, angle: angleDeg };
  };

  const bikeState = useMemo(() => getBikePosition(deliveryProgress), [deliveryProgress]);

  // 1. PRIORITY: Cart Checkout View
  // If items are added to the cart, show this view FIRST, regardless of active order status.
  // This allows users to order again while previous order is still in history/tracking.
  if (items.length > 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="h-32 bg-gradient-to-r from-gray-50 to-white flex items-center justify-center border-b border-gray-100">
               <div className="flex items-center text-gray-500 gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <Clock size={20} className="text-green-600" /> 
                  <span className="font-medium">Delivery in 35-45 min</span>
               </div>
           </div>
           <div className="p-6">
              {items.map(item => (
                 <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                    <div className="flex gap-4 items-center">
                       <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                       </div>
                       <div>
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm mb-1 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <h3 className="font-bold text-gray-800">{item.name}</h3>
                          <div className="text-gray-500 text-sm mt-0.5">Qty: {item.quantity}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeItemCompletely(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove Item"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                 </div>
              ))}
              
              <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-2">
                 <div className="flex justify-between text-gray-500 text-sm">
                    <span>Item Total</span>
                    <span>₹{cartTotal}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-sm">
                    <span>Delivery Fee</span>
                    <span>₹40</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-sm">
                    <span>Platform Fee</span>
                    <span>₹5</span>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">To Pay</span>
                    <span className="text-2xl font-bold text-red-600">₹{cartTotal + 45}</span>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/payment')}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 group"
              >
                 Proceed to Pay <Navigation size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  // 2. Show Active Order Tracker
  if (activeOrder) {
    if (activeOrder.status === OrderStatus.DELIVERED) {
       return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg text-center border-t-4 border-green-500 animate-fade-in">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Delivered!</h2>
           <p className="text-gray-500 mb-6">Enjoy your meal from {activeOrder.restaurantName}.</p>
           <Link 
             to="/" 
             onClick={() => {
                clearActiveOrder();
                // No navigate needed if we are just resetting state, but standard UX sends home
             }} 
             className="block w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
           >
             Order Again
           </Link>
        </div>
       );
    }

    return (
      <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row overflow-hidden">
         {/* LEFT PANEL: Order Details */}
         <div className="lg:w-1/3 bg-white shadow-xl z-20 flex flex-col h-full border-r border-gray-200 order-2 lg:order-1">
            <div className="p-6 border-b border-gray-100 bg-white">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID: {activeOrder.id}</div>
               <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeOrder.restaurantName}</h1>
               <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeOrder.status === OrderStatus.PLACED ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                     {activeOrder.status === OrderStatus.PLACED ? 'Preparing' : 'On the way'}
                  </span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-500 text-sm font-medium">Arriving in 24 mins</span>
               </div>
               
               {activeOrder.driver && (
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeOrder.driver.name}`} alt="Driver" className="w-10 h-10 rounded-full" />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-gray-900">{activeOrder.driver.name}</div>
                        <div className="text-xs text-gray-500">Vaccinated • 4.8 ★</div>
                     </div>
                     <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                        <Phone size={18} />
                     </button>
                  </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
               <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase">Order Summary</h3>
               <div className="space-y-4">
                  {activeOrder.items.map(item => (
                     <div key={item.id} className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden border border-gray-300 flex-shrink-0">
                           {item.image ? (
                              <img src={item.image} className="w-full h-full object-cover" />
                           ) : <div className="w-full h-full flex items-center justify-center text-[8px]">IMG</div>}
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-gray-800">
                              <span className="text-green-600 mr-2">{item.quantity}x</span>
                              {item.name}
                           </div>
                           <div className="text-xs text-gray-500">₹{item.price * item.quantity}</div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                  <span>Total Bill</span>
                  <span>₹{activeOrder.totalAmount}</span>
               </div>
            </div>
         </div>

         {/* RIGHT PANEL: Improved Map Simulation */}
         <div className="flex-1 relative bg-[#e5e7eb] overflow-hidden order-1 lg:order-2 h-[50vh] lg:h-auto border-b lg:border-b-0 border-gray-300">
             
             {/* Map Grid Background (Simulating Streets) */}
             <div className="absolute inset-0 pointer-events-none" 
                  style={{ 
                     backgroundImage: `
                        linear-gradient(#d1d5db 1px, transparent 1px), 
                        linear-gradient(90deg, #d1d5db 1px, transparent 1px)
                     `,
                     backgroundSize: '50px 50px',
                     backgroundColor: '#f3f4f6'
                  }}>
             </div>
             
             {/* City Blocks/Buildings Decoration */}
             <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute top-[15%] left-[15%] w-[20%] h-[20%] bg-gray-200 border border-gray-300 rounded-lg"></div>
                <div className="absolute top-[15%] right-[15%] w-[25%] h-[25%] bg-gray-200 border border-gray-300 rounded-lg"></div>
                <div className="absolute bottom-[15%] left-[25%] w-[30%] h-[15%] bg-gray-200 border border-gray-300 rounded-lg"></div>
                <div className="absolute top-[50%] left-[55%] w-[15%] h-[15%] bg-gray-200 border border-gray-300 rounded-lg"></div>
             </div>

             {/* SVG Layer for Realistic Roads */}
             <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* Road Border (Dark Grey) */}
                <polyline 
                   points={`${MAP_WAYPOINTS[0].x}%,${MAP_WAYPOINTS[0].y}% ${MAP_WAYPOINTS[1].x}%,${MAP_WAYPOINTS[1].y}% ${MAP_WAYPOINTS[2].x}%,${MAP_WAYPOINTS[2].y}% ${MAP_WAYPOINTS[3].x}%,${MAP_WAYPOINTS[3].y}% ${MAP_WAYPOINTS[4].x}%,${MAP_WAYPOINTS[4].y}% ${MAP_WAYPOINTS[5].x}%,${MAP_WAYPOINTS[5].y}%`}
                   fill="none"
                   stroke="#9ca3af"
                   strokeWidth="28"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                />
                {/* Road Surface (White) */}
                <polyline 
                   points={`${MAP_WAYPOINTS[0].x}%,${MAP_WAYPOINTS[0].y}% ${MAP_WAYPOINTS[1].x}%,${MAP_WAYPOINTS[1].y}% ${MAP_WAYPOINTS[2].x}%,${MAP_WAYPOINTS[2].y}% ${MAP_WAYPOINTS[3].x}%,${MAP_WAYPOINTS[3].y}% ${MAP_WAYPOINTS[4].x}%,${MAP_WAYPOINTS[4].y}% ${MAP_WAYPOINTS[5].x}%,${MAP_WAYPOINTS[5].y}%`}
                   fill="none"
                   stroke="white"
                   strokeWidth="22"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                />
                {/* Center Line (Dashed Yellow) */}
                <polyline 
                   points={`${MAP_WAYPOINTS[0].x}%,${MAP_WAYPOINTS[0].y}% ${MAP_WAYPOINTS[1].x}%,${MAP_WAYPOINTS[1].y}% ${MAP_WAYPOINTS[2].x}%,${MAP_WAYPOINTS[2].y}% ${MAP_WAYPOINTS[3].x}%,${MAP_WAYPOINTS[3].y}% ${MAP_WAYPOINTS[4].x}%,${MAP_WAYPOINTS[4].y}% ${MAP_WAYPOINTS[5].x}%,${MAP_WAYPOINTS[5].y}%`}
                   fill="none"
                   stroke="#fbbf24"
                   strokeWidth="2"
                   strokeDasharray="8,8"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                />
             </svg>

             {/* MARKER: Restaurant */}
             <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: '80%', top: '45%' }}>
                <div className="relative group cursor-pointer">
                   <div className="w-20 h-20 bg-red-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                   <div className="w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-xl z-10 relative hover:scale-110 transition-transform">
                      <UtensilsCrossed size={16} className="text-red-600" />
                   </div>
                   <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap shadow-lg">
                      {activeOrder.restaurantName}
                   </div>
                </div>
             </div>

             {/* MARKER: Home */}
             <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: '90%', top: '80%' }}>
                <div className="relative group cursor-pointer">
                   <div className="w-20 h-20 bg-green-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                   <div className="w-10 h-10 bg-gray-900 border-2 border-white rounded-full flex items-center justify-center shadow-xl z-10 relative hover:scale-110 transition-transform">
                      <Home size={16} className="text-white" />
                   </div>
                   <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap shadow-lg">
                      Home
                   </div>
                </div>
             </div>

             {/* MOVING MARKER: Bike */}
             {activeOrder.status !== OrderStatus.PLACED && activeOrder.status !== OrderStatus.FINDING_DRIVER && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-linear z-30"
                  style={{ 
                     left: `${bikeState.x}%`, 
                     top: `${bikeState.y}%`,
                  }}
                >
                   <div className="relative">
                      {/* Pulsing Effect */}
                      <div className="w-12 h-12 bg-blue-500/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                      
                      {/* Rotated Icon Wrapper */}
                      <div 
                        style={{ transform: `rotate(${bikeState.angle}deg)` }} 
                        className="transition-transform duration-300 ease-linear"
                      >
                          <div className="bg-white p-1.5 rounded-full shadow-xl border-2 border-blue-600">
                             {/* Using Navigation Icon for directional arrow, or Bike if preferred. Navigation looks more like a GPS pointer */}
                             <Navigation size={20} className="text-blue-600 fill-blue-600 transform rotate-90" />
                          </div>
                      </div>

                      {/* Floating Label */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                         {deliveryProgress < 45 ? 'Picking up...' : 'On the way'}
                      </div>
                   </div>
                </div>
             )}
             
             {/* Status Overlay for Initial States */}
             {(activeOrder.status === OrderStatus.PLACED || activeOrder.status === OrderStatus.FINDING_DRIVER) && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-40">
                   <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce-in border border-gray-100">
                      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h3 className="font-bold text-lg text-gray-800">Finding nearby partner...</h3>
                      <p className="text-sm text-gray-500 mt-1">This won't take long</p>
                   </div>
                </div>
             )}
         </div>
      </div>
    );
  }

  // 3. Empty State (Default if no items and no active order)
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
       <div className="bg-red-50 p-6 rounded-full mb-4">
         <Bike size={48} className="text-red-400" />
       </div>
       <h2 className="text-2xl font-bold text-gray-800 mb-2">Good food is waiting</h2>
       <p className="text-gray-500 mb-6">Your cart is empty. Add some delicious items from the menu.</p>
       <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Browse Restaurants</Link>
    </div>
  );
};
