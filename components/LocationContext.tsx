
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DelhiLocation } from '../types';

interface LocationContextType {
  selectedLocation: DelhiLocation;
  setSelectedLocation: (loc: DelhiLocation) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<DelhiLocation>('All Locations');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, searchQuery, setSearchQuery }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocationContext must be used within a LocationProvider');
  return context;
};
