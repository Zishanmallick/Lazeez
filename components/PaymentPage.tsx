
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone, ChevronRight, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const { cartTotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (selectedMethod === 'UPI' && !upiId) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    setIsProcessing(true);
    // Simulate Payment Processing
    setTimeout(() => {
       setIsProcessing(false);
       placeOrder(selectedMethod);
       toast.success("Payment Successful!");
       navigate('/track-order');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       <div className="bg-white shadow-sm p-4 mb-4 sticky top-16 z-10">
          <h1 className="text-xl font-bold text-gray-800">Payment Options</h1>
          <p className="text-sm text-gray-500">Total: ₹{cartTotal}</p>
       </div>

       <div className="max-w-4xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
          {/* Left Side: Methods */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                Recommended
             </div>
             
             {/* UPI Method */}
             <div 
               onClick={() => setSelectedMethod('UPI')}
               className={`p-6 border-b border-gray-100 cursor-pointer transition-colors ${selectedMethod === 'UPI' ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
             >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                         <Smartphone className="text-orange-500" size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-800">UPI</h3>
                         <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'UPI' ? 'border-red-600' : 'border-gray-300'}`}>
                      {selectedMethod === 'UPI' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                   </div>
                </div>
                
                {selectedMethod === 'UPI' && (
                   <div className="pl-14 animate-fade-in">
                      <div className="mb-4">
                         <p className="text-sm font-bold text-gray-700 mb-2">Pay via QR Code</p>
                         <div className="bg-white p-4 border border-gray-200 rounded-xl inline-block shadow-sm">
                             <QrCode size={120} className="text-gray-800" />
                         </div>
                         <p className="text-xs text-gray-400 mt-1">Scan with any UPI App</p>
                      </div>
                      <div className="flex items-center gap-3 my-4">
                         <div className="h-px bg-gray-200 flex-1"></div>
                         <span className="text-xs text-gray-400 font-medium">OR</span>
                         <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-700 mb-2">Enter UPI ID</p>
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="example@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500"
                            />
                            <button className="text-red-600 font-bold text-sm px-3 hover:bg-red-50 rounded-lg">Verify</button>
                         </div>
                      </div>
                   </div>
                )}
             </div>

             {/* Card Method */}
             <div 
               onClick={() => setSelectedMethod('CARD')}
               className={`p-6 border-b border-gray-100 cursor-pointer transition-colors ${selectedMethod === 'CARD' ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                         <CreditCard className="text-blue-500" size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-800">Credit / Debit Cards</h3>
                         <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'CARD' ? 'border-red-600' : 'border-gray-300'}`}>
                      {selectedMethod === 'CARD' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                   </div>
                </div>
             </div>

             {/* COD Method */}
             <div 
               onClick={() => setSelectedMethod('COD')}
               className={`p-6 cursor-pointer transition-colors ${selectedMethod === 'COD' ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                         <Banknote className="text-green-600" size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-800">Cash on Delivery</h3>
                         <p className="text-sm text-gray-500">Pay cash to delivery partner</p>
                      </div>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'COD' ? 'border-red-600' : 'border-gray-300'}`}>
                      {selectedMethod === 'COD' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                   </div>
                </div>
             </div>
          </div>

          {/* Right Side: Summary & Pay */}
          <div className="lg:w-80">
             <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-32">
                <h2 className="font-bold text-lg mb-4">Bill Details</h2>
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Item Total</span>
                      <span>₹{cartTotal}</span>
                   </div>
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Delivery Fee</span>
                      <span>₹40</span>
                   </div>
                   <div className="flex justify-between text-gray-600 text-sm">
                      <span>Platform Fee</span>
                      <span>₹5</span>
                   </div>
                   <div className="flex justify-between text-green-600 text-sm font-medium">
                      <span>Discount</span>
                      <span>-₹0</span>
                   </div>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-lg mb-6">
                   <span>To Pay</span>
                   <span>₹{cartTotal + 45}</span>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                >
                   {isProcessing ? 'Processing...' : `Pay ₹${cartTotal + 45}`}
                   {!isProcessing && <ChevronRight size={18} />}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
