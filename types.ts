
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER'
}

export type DelhiLocation = 'All Locations' | 'Connaught Place' | 'Old Delhi' | 'Khan Market' | 'Hauz Khas' | 'Lajpat Nagar' | 'South Campus' | 'Pandara Road';

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface FoodCategory {
  id: string;
  name: string;
  image: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  image?: string;
  votes?: number; // Mock data for "150 votes"
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: DelhiLocation; 
  rating: number;
  cuisineTags: string[];
  imageUrl: string;
  lat: number;
  lon: number;
  menu: MenuItem[];
  discount?: string; // e.g. "50% OFF up to ₹100"
  deliveryTime?: string; // e.g. "30-35 min"
  costForTwo?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: OrderStatus;
  driver?: {
    name: string;
    phone: string;
  };
}

export interface DeliveryPartner {
  id: string;
  name: string;
  currentLat: number;
  currentLon: number;
  distance: number; // km
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PLACED = 'PLACED',
  FINDING_DRIVER = 'FINDING_DRIVER',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
