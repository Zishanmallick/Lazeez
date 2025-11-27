
import React from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { User, MapPin, Phone, Mail, Clock, ChevronRight, Package, Bike, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderStatus } from '../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { activeOrder, pastOrders } = useCart();

  if (!user) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED: return 'text-blue-600 bg-blue-50';
      case OrderStatus.DELIVERED: return 'text-green-600 bg-green-50';
      case OrderStatus.CANCELLED: return 'text-red-600 bg-red-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl font-bold">
                {user.name.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-gray-500 text-sm">{user.email}</p>
             <div className="mt-4 flex justify-center gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Gold Member</span>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
             <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} />
                <span>+91 98765 43210</span>
             </div>
             <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} />
                <span>{user.email}</span>
             </div>
             <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} />
                <span>Hauz Khas, New Delhi</span>
             </div>
          </div>
        </div>

        {/* Right Column: Orders */}
        <div className="md:col-span-2 space-y-8">
           
           {/* Active Order Card */}
           {activeOrder && activeOrder.status !== OrderStatus.DELIVERED && (
             <div className="bg-white rounded-2xl shadow-md border border-red-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                            <Bike size={20} />
                            <span>Live Order</span>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900">{activeOrder.restaurantName}</h3>
                         <p className="text-sm text-gray-500">{activeOrder.items.map(i => i.name).join(', ')}</p>
                      </div>
                      <div className="text-right">
                         <div className="text-lg font-bold">₹{activeOrder.totalAmount}</div>
                         <div className="text-xs text-gray-400">ORDER #{activeOrder.id}</div>
                      </div>
                   </div>
                   
                   <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                           <Clock size={18} className="text-orange-500" />
                         </div>
                         <div>
                           <div className="font-bold text-gray-800">{activeOrder.status.replace('_', ' ')}</div>
                           <div className="text-xs text-gray-500">Estimated arrival in 25 mins</div>
                         </div>
                      </div>
                   </div>

                   <Link to="/track-order" className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                      Track Order
                   </Link>
                </div>
             </div>
           )}

           {/* Past Orders */}
           <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Package size={22} /> Past Orders
              </h3>
              
              <div className="space-y-4">
                 {pastOrders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start gap-4">
                             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <Package size={24} />
                             </div>
                             <div>
                                <h4 className="font-bold text-gray-900">{order.restaurantName}</h4>
                                <p className="text-xs text-gray-500 mb-1">{order.items.map(i => `${i.quantity} x ${i.name}`).join(', ')}</p>
                                <div className="text-xs text-gray-400">{order.date}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="font-bold text-gray-900">₹{order.totalAmount}</div>
                             <div className={`text-xs font-bold px-2 py-1 rounded-md inline-block mt-1 ${getStatusColor(order.status)}`}>
                                {order.status}
                             </div>
                          </div>
                       </div>
                       <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                             <CheckCircle2 size={14} /> Delivered
                          </div>
                          <Link to={`/restaurant/${order.restaurantId}`} className="text-red-600 text-sm font-bold hover:underline flex items-center gap-1">
                             Reorder <ChevronRight size={14} />
                          </Link>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
