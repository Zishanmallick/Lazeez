
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { RestaurantView } from './components/RestaurantView';
import { AIRecommendations } from './components/AIRecommendations';
import { OrderTracker } from './components/OrderTracker';
import { PaymentPage } from './components/PaymentPage';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LocationProvider } from './components/LocationContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { LazeezChatbot } from './components/LazeezChatbot';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/landing" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow pt-16 relative">
        {children}
        <LazeezChatbot />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <HashRouter>
             <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/*" element={
                  <ProtectedLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/restaurant/:id" element={<RestaurantView />} />
                      <Route path="/recommendations" element={<AIRecommendations />} />
                      <Route path="/track-order" element={<OrderTracker />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ProtectedLayout>
                } />
             </Routes>
             <Toaster position="bottom-right" />
          </HashRouter>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;