
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '../types';
import { RESTAURANTS, DRIVER_NAMES } from '../constants';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  cartRestaurantId: string | null;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  removeItemCompletely: (itemId: string) => void; // Added specific removal
  clearCart: () => void;
  cartTotal: number;
  
  // Order Management
  activeOrder: Order | null;
  pastOrders: Order[];
  placeOrder: (method: string) => void;
  clearActiveOrder: () => void;
  
  // Tracking
  deliveryProgress: number; // 0 to 100 floating point for smooth animation
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DUMMY_HISTORY: Order[] = [
  {
    id: 'ORD-7782',
    restaurantId: 'r1',
    restaurantName: "Karim's",
    items: [
      { ...RESTAURANTS[0].menu[0], quantity: 1 },
      { ...RESTAURANTS[0].menu[2], quantity: 2 }
    ],
    totalAmount: 660,
    date: 'Yesterday, 8:30 PM',
    status: OrderStatus.DELIVERED
  },
  {
    id: 'ORD-5521',
    restaurantId: 'r9',
    restaurantName: "The Big Chill",
    items: [
      { ...RESTAURANTS[8].menu[0], quantity: 1 },
      { ...RESTAURANTS[8].menu[3], quantity: 1 }
    ],
    totalAmount: 1240,
    date: '22 Oct, 1:15 PM',
    status: OrderStatus.DELIVERED
  }
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartRestaurantId, setCartRestaurantId] = useState<string | null>(null);
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>(DUMMY_HISTORY);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  // Global Order Simulation Effect
  useEffect(() => {
    if (!activeOrder || activeOrder.status === OrderStatus.DELIVERED || activeOrder.status === OrderStatus.CANCELLED) return;

    let interval: ReturnType<typeof setInterval>;

    // Logic to advance status and progress
    const advanceOrder = () => {
      
      // 1. PLACED -> FINDING_DRIVER
      if (activeOrder.status === OrderStatus.PLACED) {
         setTimeout(() => {
            setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.FINDING_DRIVER } : null);
         }, 2000);
      }
      
      // 2. FINDING_DRIVER -> DRIVER_ASSIGNED
      else if (activeOrder.status === OrderStatus.FINDING_DRIVER) {
         setTimeout(() => {
            const randomDriver = DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)];
            setActiveOrder(prev => prev ? { 
               ...prev, 
               status: OrderStatus.DRIVER_ASSIGNED,
               driver: { name: randomDriver, phone: '+91 98765 43210' }
            } : null);
            toast.success(`Driver ${randomDriver} assigned!`);
         }, 3000);
      }

      // 3. Animation Loop for Movement
      else {
         // Update every 30ms for smoother animation (approx 30fps)
         interval = setInterval(() => {
            setDeliveryProgress(prev => {
               // Phase 1: Driver going to Restaurant (0% to 45%)
               if (activeOrder.status === OrderStatus.DRIVER_ASSIGNED) {
                  if (prev < 45) {
                     return prev + 0.10; // Slower increment for smoother feel
                  } else {
                     // Arrived at Restaurant
                     setActiveOrder(o => o ? { ...o, status: OrderStatus.PICKED_UP } : null);
                     toast.success("Driver picked up your order!");
                     return 45;
                  }
               }
               
               // Phase 2: Driver going to User (45% to 100%)
               if (activeOrder.status === OrderStatus.PICKED_UP) {
                  if (prev < 100) {
                     return prev + 0.05; // Slower increment
                  } else {
                     // Delivered
                     setActiveOrder(o => {
                        if(!o) return null;
                        const finished = { ...o, status: OrderStatus.DELIVERED };
                        toast.success("Order Delivered!");
                        setPastOrders(h => [finished, ...h]);
                        return finished;
                     });
                     clearInterval(interval);
                     return 100;
                  }
               }
               return prev;
            });
         }, 30); 
      }
    };

    advanceOrder();

    return () => {
       if(interval) clearInterval(interval);
    };
  }, [activeOrder?.status]);


  const addToCart = (item: MenuItem) => {
    if (cartRestaurantId && cartRestaurantId !== item.restaurantId) {
      if (window.confirm("Your cart contains items from another restaurant. Reset cart?")) {
        setItems([{ ...item, quantity: 1 }]);
        setCartRestaurantId(item.restaurantId);
        toast.success(`Cart reset. Added ${item.name}`);
      }
      return;
    }

    if (!cartRestaurantId) {
      setCartRestaurantId(item.restaurantId);
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        toast.success(`Added another ${item.name}`);
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`Added ${item.name} to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => {
      // Check if item exists and has quantity > 1
      const existingItem = prev.find(i => i.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }

      // If quantity is 1 or item not found, remove it
      const newItems = prev.filter(i => i.id !== itemId);
      if (newItems.length === 0) {
        setCartRestaurantId(null);
      }
      return newItems;
    });
  };

  const removeItemCompletely = (itemId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== itemId);
      if (newItems.length === 0) {
        setCartRestaurantId(null);
      }
      return newItems;
    });
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    setCartRestaurantId(null);
  };

  const placeOrder = (method: string) => {
    if (items.length === 0) return;

    const restaurant = RESTAURANTS.find(r => r.id === cartRestaurantId);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: cartRestaurantId || '',
      restaurantName: restaurant?.name || 'Unknown Restaurant',
      items: [...items],
      totalAmount: cartTotal,
      date: 'Just Now',
      status: OrderStatus.PLACED
    };

    setDeliveryProgress(0);
    setActiveOrder(newOrder);
    clearCart();
  };
  
  const clearActiveOrder = () => {
    setActiveOrder(null);
    setDeliveryProgress(0);
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      cartRestaurantId, 
      addToCart, 
      removeFromCart, 
      removeItemCompletely,
      clearCart, 
      cartTotal,
      activeOrder,
      pastOrders,
      placeOrder,
      clearActiveOrder,
      deliveryProgress
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
